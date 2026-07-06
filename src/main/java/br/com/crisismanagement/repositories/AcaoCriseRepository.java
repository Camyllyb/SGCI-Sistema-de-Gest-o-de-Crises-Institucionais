package br.com.crisismanagement.repositories;

import java.util.List;

import br.com.crisismanagement.entities.AcaoCrise;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AcaoCriseRepository implements PanacheRepository<AcaoCrise> {

    public List<AcaoCrise> listByCrise(Long criseId) {
        return list("criseId = ?1 order by createdAt desc", criseId);
    }
}
