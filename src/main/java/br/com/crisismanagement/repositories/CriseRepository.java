package br.com.crisismanagement.repositories;

import java.util.List;

import br.com.crisismanagement.entities.Crise;
import br.com.crisismanagement.entities.enums.NivelCriticidade;
import br.com.crisismanagement.entities.enums.StatusCrise;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CriseRepository implements PanacheRepository<Crise> {

    public List<Crise> listAllOrdered() {
        return list("order by createdAt desc");
    }

    /** Crises cadastradas por um usuario especifico (visao do perfil COMUM). */
    public List<Crise> listByCreator(Long createdBy) {
        return list("createdBy = ?1 order by createdAt desc", createdBy);
    }

    public long countByCreator(Long createdBy) {
        return count("createdBy = ?1", createdBy);
    }

    public long countByStatus(StatusCrise status) {
        return count("status = ?1", status);
    }

    public long countByNivel(NivelCriticidade nivel) {
        return count("nivel = ?1", nivel);
    }
}
