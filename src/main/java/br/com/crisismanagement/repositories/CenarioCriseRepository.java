package br.com.crisismanagement.repositories;

import java.util.List;

import br.com.crisismanagement.entities.CenarioCrise;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CenarioCriseRepository implements PanacheRepository<CenarioCrise> {

    public List<CenarioCrise> listAllOrdered() {
        return list("order by descricao");
    }
}
