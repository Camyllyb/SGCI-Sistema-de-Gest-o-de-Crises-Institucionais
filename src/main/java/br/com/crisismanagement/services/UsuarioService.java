package br.com.crisismanagement.services;

import java.time.LocalDateTime;
import java.util.List;

import org.eclipse.microprofile.jwt.JsonWebToken;

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

    @Inject
    UserRepository userRepository;

    @Inject
    JsonWebToken jsonWebToken;

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
        if (request.password() == null || request.password().isBlank()) {
            throw new BadRequestException("A senha é obrigatória na criação do usuário.");
        }
        userRepository.findByEmail(request.email()).ifPresent(u -> {
            throw new BadRequestException("Já existe um usuário com este e-mail.");
        });

        User user = new User();
        user.name = request.name();
        user.email = request.email();
        user.password = BcryptUtil.bcryptHash(request.password());
        user.perfil = request.perfil();
        user.departamentoId = request.departamentoId();
        user.active = request.active() == null || request.active();
        user.createdAt = LocalDateTime.now();
        userRepository.persist(user);
        return UsuarioResponse.from(user);
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
