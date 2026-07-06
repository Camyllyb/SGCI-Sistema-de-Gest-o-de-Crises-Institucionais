package br.com.crisismanagement.repositories;

import java.util.List;

import br.com.crisismanagement.entities.TipoCrise;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class TipoCriseRepository implements PanacheRepository<TipoCrise> {

    public List<TipoCrise> listAllOrdered() {
        return list("order by nome");
    }
}
