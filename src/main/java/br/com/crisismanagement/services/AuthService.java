package br.com.crisismanagement.services;

import java.time.Duration;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.jwt.JsonWebToken;

import br.com.crisismanagement.dto.UserResponse;
import br.com.crisismanagement.entities.User;
import br.com.crisismanagement.exceptions.InvalidCredentialsException;
import br.com.crisismanagement.repositories.UserRepository;
import io.quarkus.elytron.security.common.BcryptUtil;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;

@ApplicationScoped
public class AuthService {

    public static final long TOKEN_EXPIRATION_SECONDS = Duration.ofHours(1).toSeconds();

    /** Resultado do login: token JWT + se o usuário deve trocar a senha. */
    public record LoginResult(String token, boolean mustChangePassword) {
    }

    @Inject
    UserRepository userRepository;

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
        Long id = Long.valueOf(jsonWebToken.getSubject());
        User user = userRepository.findByIdOptional(id)
                .orElseThrow(InvalidCredentialsException::new);
        return new UserResponse(user.id, user.name, user.email, user.perfil, user.mustChangePassword);
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
}
