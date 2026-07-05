package br.com.crisismanagement.config;

import java.time.LocalDateTime;

import br.com.crisismanagement.entities.User;
import br.com.crisismanagement.repositories.UserRepository;
import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class DataSeeder {

    private static final String ADMIN_EMAIL = "admin@crisis.local";
    private static final String ADMIN_PASSWORD = "Admin@123";

    @Inject
    UserRepository userRepository;

    @Transactional
    void onStart(@Observes StartupEvent event) {
        if (userRepository.findByEmail(ADMIN_EMAIL).isPresent()) {
            return;
        }

        User admin = new User();
        admin.name = "Administrador";
        admin.email = ADMIN_EMAIL;
        admin.password = BcryptUtil.bcryptHash(ADMIN_PASSWORD);
        admin.active = true;
        admin.createdAt = LocalDateTime.now();
        userRepository.persist(admin);
    }
}
