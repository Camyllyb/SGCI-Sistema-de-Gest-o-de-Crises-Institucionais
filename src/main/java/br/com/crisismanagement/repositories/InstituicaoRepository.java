package br.com.crisismanagement.repositories;

import java.util.List;

import br.com.crisismanagement.entities.Instituicao;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class InstituicaoRepository implements PanacheRepository<Instituicao> {

    public List<Instituicao> listAllOrdered() {
        return list("order by nome");
    }
}
