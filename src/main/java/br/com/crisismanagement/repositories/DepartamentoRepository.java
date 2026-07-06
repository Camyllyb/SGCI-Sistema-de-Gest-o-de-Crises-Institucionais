package br.com.crisismanagement.repositories;

import java.util.List;

import br.com.crisismanagement.entities.Departamento;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class DepartamentoRepository implements PanacheRepository<Departamento> {

    public List<Departamento> listAllOrdered() {
        return list("order by nome");
    }
}
