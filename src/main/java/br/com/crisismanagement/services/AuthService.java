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

@ApplicationScoped
public class AuthService {

    public static final long TOKEN_EXPIRATION_SECONDS = Duration.ofHours(1).toSeconds();

    @Inject
    UserRepository userRepository;

    @Inject
    JsonWebToken jsonWebToken;

    @ConfigProperty(name = "mp.jwt.verify.issuer")
    String issuer;

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (!user.active || !BcryptUtil.matches(password, user.password)) {
            throw new InvalidCredentialsException();
        }

        return Jwt.issuer(issuer)
                .subject(user.id.toString())
                .claim("name", user.name)
                .claim("email", user.email)
                .expiresIn(TOKEN_EXPIRATION_SECONDS)
                .sign();
    }

    public UserResponse getCurrentUser() {
        Long id = Long.valueOf(jsonWebToken.getSubject());
        User user = userRepository.findByIdOptional(id)
                .orElseThrow(InvalidCredentialsException::new);
        return new UserResponse(user.id, user.name, user.email);
    }
}
