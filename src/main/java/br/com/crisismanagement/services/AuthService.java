package br.com.crisismanagement.services;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.logging.Logger;

import br.com.crisismanagement.dto.ProfileResponse;
import br.com.crisismanagement.dto.UserResponse;
import br.com.crisismanagement.entities.User;
import br.com.crisismanagement.exceptions.InvalidCredentialsException;
import br.com.crisismanagement.repositories.DepartamentoRepository;
import br.com.crisismanagement.repositories.InstituicaoRepository;
import br.com.crisismanagement.repositories.UserRepository;
import io.quarkus.elytron.security.common.BcryptUtil;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;

@ApplicationScoped
public class AuthService {

    private static final Logger LOG = Logger.getLogger(AuthService.class);

    public static final long TOKEN_EXPIRATION_SECONDS = Duration.ofHours(1).toSeconds();

    /** Validade do link de recuperação de senha. */
    private static final long RESET_TOKEN_MINUTES = 30;

    private static final SecureRandom RANDOM = new SecureRandom();

    /** Resultado do login: token JWT + se o usuário deve trocar a senha. */
    public record LoginResult(String token, boolean mustChangePassword) {
    }

    @Inject
    UserRepository userRepository;

    @Inject
    DepartamentoRepository departamentoRepository;

    @Inject
    InstituicaoRepository instituicaoRepository;

    @Inject
    EmailService emailService;

    @Inject
    JsonWebToken jsonWebToken;

    @ConfigProperty(name = "mp.jwt.verify.issuer")
    String issuer;

    public LoginResult login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (!user.active || !BcryptUtil.matches(password, user.password)) {
            throw new InvalidCredentialsException();
        }

        return new LoginResult(issueToken(user), user.mustChangePassword);
    }

    /**
     * Troca a senha do usuário autenticado, validando a senha atual. Retorna um
     * novo token JWT para reemissão do cookie.
     */
    @Transactional
    public String changePassword(String currentPassword, String newPassword) {
        Long id = Long.valueOf(jsonWebToken.getSubject());
        User user = userRepository.findByIdOptional(id)
                .orElseThrow(InvalidCredentialsException::new);

        if (!BcryptUtil.matches(currentPassword, user.password)) {
            throw new BadRequestException("Senha atual incorreta.");
        }
        if (BcryptUtil.matches(newPassword, user.password)) {
            throw new BadRequestException("A nova senha deve ser diferente da atual.");
        }

        user.password = BcryptUtil.bcryptHash(newPassword);
        user.mustChangePassword = false;
        return issueToken(user);
    }

    public UserResponse getCurrentUser() {
        User user = usuarioAutenticado();
        return new UserResponse(user.id, user.name, user.email, user.perfil, user.mustChangePassword);
    }

    /** Dados cadastrais do usuário autenticado com nomes de departamento/instituição resolvidos. */
    public ProfileResponse getProfile() {
        User user = usuarioAutenticado();
        String departamentoNome = user.departamentoId == null ? null
                : departamentoRepository.findByIdOptional(user.departamentoId)
                        .map(d -> d.nome).orElse(null);
        String instituicaoNome = user.instituicaoId == null ? null
                : instituicaoRepository.findByIdOptional(user.instituicaoId)
                        .map(i -> i.nome).orElse(null);
        return new ProfileResponse(user.id, user.name, user.email, user.perfil, user.cargo,
                user.departamentoId, departamentoNome, user.instituicaoId, instituicaoNome);
    }

    /**
     * Inicia a recuperação de senha. Por segurança, não revela se o e-mail existe:
     * o fluxo é sempre silencioso do ponto de vista do chamador. Guarda apenas o
     * hash do token; o valor original vai somente no e-mail.
     */
    @Transactional
    public void requestPasswordReset(String email) {
        userRepository.findByEmail(email).filter(u -> u.active).ifPresent(user -> {
            String token = gerarToken();
            user.resetToken = sha256(token);
            user.resetTokenExpiresAt = LocalDateTime.now().plusMinutes(RESET_TOKEN_MINUTES);
            try {
                emailService.enviarLinkRecuperacao(user.name, user.email, token, RESET_TOKEN_MINUTES);
            } catch (RuntimeException e) {
                // Não propaga: a resposta ao cliente é sempre neutra. O log ajuda o suporte.
                LOG.errorf(e, "Falha ao enviar e-mail de recuperação para %s", user.email);
            }
        });
    }

    /** Redefine a senha a partir do token recebido por e-mail (uso único, com expiração). */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(sha256(token))
                .filter(u -> u.resetTokenExpiresAt != null
                        && u.resetTokenExpiresAt.isAfter(LocalDateTime.now()))
                .orElseThrow(() -> new BadRequestException(
                        "Link de recuperação inválido ou expirado. Solicite um novo."));

        user.password = BcryptUtil.bcryptHash(newPassword);
        user.mustChangePassword = false;
        user.resetToken = null;
        user.resetTokenExpiresAt = null;
    }

    private User usuarioAutenticado() {
        Long id = Long.valueOf(jsonWebToken.getSubject());
        return userRepository.findByIdOptional(id)
                .orElseThrow(InvalidCredentialsException::new);
    }

    private String issueToken(User user) {
        return Jwt.issuer(issuer)
                .subject(user.id.toString())
                .claim("name", user.name)
                .claim("email", user.email)
                .groups(user.perfil.name())
                .expiresIn(TOKEN_EXPIRATION_SECONDS)
                .sign();
    }

    private static String gerarToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Algoritmo SHA-256 indisponível", e);
        }
    }
}
