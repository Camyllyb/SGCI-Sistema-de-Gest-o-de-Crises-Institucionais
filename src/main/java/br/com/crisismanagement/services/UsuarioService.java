package br.com.crisismanagement.services;

import java.time.LocalDateTime;
import java.util.List;

import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.logging.Logger;

import br.com.crisismanagement.dto.UsuarioRequest;
import br.com.crisismanagement.dto.UsuarioResponse;
import br.com.crisismanagement.entities.User;
import br.com.crisismanagement.repositories.UserRepository;
import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;

/**
 * BO (Business Object) de usuários: regras de negócio do CRUD administrativo
 * (unicidade de e-mail, hashing de senha, proteção de auto-desativação). O
 * acesso a dados é feito pelo DAO {@link UserRepository}.
 */
@ApplicationScoped
public class UsuarioService {

    private static final Logger LOG = Logger.getLogger(UsuarioService.class);

    @Inject
    UserRepository userRepository;

    @Inject
    JsonWebToken jsonWebToken;

    @Inject
    EmailService emailService;

    public List<UsuarioResponse> listAll() {
        return userRepository.listAllOrdered().stream()
                .map(UsuarioResponse::from)
                .toList();
    }

    public UsuarioResponse findById(Long id) {
        return UsuarioResponse.from(getOrThrow(id));
    }

    @Transactional
    public UsuarioResponse create(UsuarioRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(u -> {
            throw new BadRequestException("Já existe um usuário com este e-mail.");
        });

        User user = new User();
        user.name = request.name();
        user.email = request.email();
        user.perfil = request.perfil();
        user.departamentoId = request.departamentoId();
        user.active = request.active() == null || request.active();
        user.createdAt = LocalDateTime.now();

        // Se o admin não informar senha, gera uma temporária e envia por e-mail;
        // o usuário será forçado a trocá-la no primeiro login.
        boolean senhaInformada = request.password() != null && !request.password().isBlank();
        String senhaTemporaria = senhaInformada ? request.password() : PasswordGenerator.generate();
        user.password = BcryptUtil.bcryptHash(senhaTemporaria);
        user.mustChangePassword = !senhaInformada;

        userRepository.persist(user);

        if (!senhaInformada) {
            // O envio não deve derrubar a criação da conta: se o SMTP falhar, o
            // usuário fica registrado e o admin pode reenviar via "Reset senha".
            try {
                emailService.enviarSenhaTemporaria(user.name, user.email, senhaTemporaria);
            } catch (RuntimeException e) {
                LOG.errorf(e, "Usuário %s criado, mas o envio da senha temporária por e-mail falhou. "
                        + "Verifique a configuração de SMTP (MAIL_*) e use 'Reset senha' para reenviar.",
                        user.email);
            }
        }
        return UsuarioResponse.from(user);
    }

    /** Gera uma nova senha temporária, força troca no próximo login e reenvia por e-mail. */
    @Transactional
    public void resetPassword(Long id) {
        User user = getOrThrow(id);
        String senhaTemporaria = PasswordGenerator.generate();
        user.password = BcryptUtil.bcryptHash(senhaTemporaria);
        user.mustChangePassword = true;
        emailService.enviarSenhaTemporaria(user.name, user.email, senhaTemporaria);
    }

    @Transactional
    public UsuarioResponse update(Long id, UsuarioRequest request) {
        User user = getOrThrow(id);

        userRepository.findByEmail(request.email())
                .filter(other -> !other.id.equals(id))
                .ifPresent(u -> {
                    throw new BadRequestException("Já existe outro usuário com este e-mail.");
                });

        user.name = request.name();
        user.email = request.email();
        user.perfil = request.perfil();
        user.departamentoId = request.departamentoId();
        if (request.active() != null) {
            user.active = request.active();
        }
        if (request.password() != null && !request.password().isBlank()) {
            user.password = BcryptUtil.bcryptHash(request.password());
            user.mustChangePassword = false;
        }
        return UsuarioResponse.from(user);
    }

    @Transactional
    public void deactivate(Long id) {
        User user = getOrThrow(id);
        Long atual = Long.valueOf(jsonWebToken.getSubject());
        if (user.id.equals(atual)) {
            throw new BadRequestException("Você não pode desativar o próprio usuário.");
        }
        user.active = false;
    }

    private User getOrThrow(Long id) {
        return userRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado: " + id));
    }
}
