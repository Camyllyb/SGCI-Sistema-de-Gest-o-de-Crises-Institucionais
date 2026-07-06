package br.com.crisismanagement.services;

import java.time.LocalDateTime;
import java.util.List;

import br.com.crisismanagement.dto.DepartamentoRequest;
import br.com.crisismanagement.dto.DepartamentoResponse;
import br.com.crisismanagement.entities.Departamento;
import br.com.crisismanagement.repositories.DepartamentoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class DepartamentoService {

    @Inject
    DepartamentoRepository departamentoRepository;

    public List<DepartamentoResponse> listAll() {
        return departamentoRepository.listAllOrdered().stream()
                .map(DepartamentoResponse::from)
                .toList();
    }

    public DepartamentoResponse findById(Long id) {
        return DepartamentoResponse.from(getOrThrow(id));
    }

    @Transactional
    public DepartamentoResponse create(DepartamentoRequest request) {
        Departamento departamento = new Departamento();
        departamento.nome = request.nome();
        departamento.sigla = request.sigla();
        departamento.active = true;
        departamento.createdAt = LocalDateTime.now();
        departamentoRepository.persist(departamento);
        return DepartamentoResponse.from(departamento);
    }

    @Transactional
    public DepartamentoResponse update(Long id, DepartamentoRequest request) {
        Departamento departamento = getOrThrow(id);
        departamento.nome = request.nome();
        departamento.sigla = request.sigla();
        return DepartamentoResponse.from(departamento);
    }

    @Transactional
    public void deactivate(Long id) {
        Departamento departamento = getOrThrow(id);
        departamento.active = false;
    }

    private Departamento getOrThrow(Long id) {
        return departamentoRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Departamento não encontrado: " + id));
    }
}
