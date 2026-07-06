package br.com.crisismanagement.repositories;

import java.util.List;

import br.com.crisismanagement.entities.RelatorioCrise;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RelatorioCriseRepository implements PanacheRepository<RelatorioCrise> {

    public List<RelatorioCrise> listAllOrdered() {
        return list("order by createdAt desc");
    }

    public boolean existsByCrise(Long criseId) {
        return count("criseId = ?1", criseId) > 0;
    }
}
