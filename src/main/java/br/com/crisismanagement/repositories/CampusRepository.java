package br.com.crisismanagement.repositories;

import java.util.List;

import br.com.crisismanagement.entities.Campus;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CampusRepository implements PanacheRepository<Campus> {

    public List<Campus> listAllOrdered() {
        return list("order by nome");
    }
}
