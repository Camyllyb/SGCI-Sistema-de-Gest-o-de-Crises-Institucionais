package br.com.crisismanagement.repositories;

import java.util.List;
import java.util.Optional;

import br.com.crisismanagement.entities.User;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UserRepository implements PanacheRepository<User> {

    public Optional<User> findByEmail(String email) {
        return find("email", email).firstResultOptional();
    }

    public List<User> listAllOrdered() {
        return list("order by name");
    }
}
