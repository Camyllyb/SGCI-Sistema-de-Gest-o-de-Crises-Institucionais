package br.com.crisismanagement.config;

import java.time.LocalDateTime;

import br.com.crisismanagement.entities.User;
import br.com.crisismanagement.entities.enums.PerfilUsuario;
import br.com.crisismanagement.repositories.DepartamentoRepository;
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

    private static final String COMUM_EMAIL = "usuario@crisis.local";
    private static final String COMUM_PASSWORD = "Comum@123";

    @Inject
    UserRepository userRepository;

    @Inject
    DepartamentoRepository departamentoRepository;

    @Transactional
    void onStart(@Observes StartupEvent event) {
        seedAdmin();
        seedComum();
    }

    private void seedAdmin() {
        if (userRepository.findByEmail(ADMIN_EMAIL).isPresent()) {
            return;
        }
        User admin = new User();
        admin.name = "Administrador";
        admin.email = ADMIN_EMAIL;
        admin.password = BcryptUtil.bcryptHash(ADMIN_PASSWORD);
        admin.perfil = PerfilUsuario.ADMIN;
        admin.active = true;
        admin.createdAt = LocalDateTime.now();
        userRepository.persist(admin);
    }

    private void seedComum() {
        if (userRepository.findByEmail(COMUM_EMAIL).isPresent()) {
            return;
        }
        User comum = new User();
        comum.name = "Usuário Comum";
        comum.email = COMUM_EMAIL;
        comum.password = BcryptUtil.bcryptHash(COMUM_PASSWORD);
        comum.perfil = PerfilUsuario.COMUM;
        comum.departamentoId = departamentoRepository.findAll().firstResultOptional()
                .map(departamento -> departamento.id)
                .orElse(null);
        comum.active = true;
        comum.createdAt = LocalDateTime.now();
        userRepository.persist(comum);
    }
}
