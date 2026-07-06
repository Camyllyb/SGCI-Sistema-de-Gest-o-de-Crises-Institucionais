package br.com.crisismanagement.services;

import java.time.LocalDateTime;
import java.util.List;

import br.com.crisismanagement.dto.CenarioCriseRequest;
import br.com.crisismanagement.dto.CenarioCriseResponse;
import br.com.crisismanagement.entities.CenarioCrise;
import br.com.crisismanagement.repositories.CenarioCriseRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class CenarioCriseService {

    @Inject
    CenarioCriseRepository cenarioCriseRepository;

    public List<CenarioCriseResponse> listAll() {
        return cenarioCriseRepository.listAllOrdered().stream()
                .map(CenarioCriseResponse::from)
                .toList();
    }

    public CenarioCriseResponse findById(Long id) {
        return CenarioCriseResponse.from(getOrThrow(id));
    }

    @Transactional
    public CenarioCriseResponse create(CenarioCriseRequest request) {
        CenarioCrise cenario = new CenarioCrise();
        cenario.descricao = request.descricao();
        cenario.nivelSugerido = request.nivelSugerido();
        cenario.tipoCriseId = request.tipoCriseId();
        cenario.departamentoId = request.departamentoId();
        cenario.active = true;
        cenario.createdAt = LocalDateTime.now();
        cenarioCriseRepository.persist(cenario);
        return CenarioCriseResponse.from(cenario);
    }

    @Transactional
    public CenarioCriseResponse update(Long id, CenarioCriseRequest request) {
        CenarioCrise cenario = getOrThrow(id);
        cenario.descricao = request.descricao();
        cenario.nivelSugerido = request.nivelSugerido();
        cenario.tipoCriseId = request.tipoCriseId();
        cenario.departamentoId = request.departamentoId();
        return CenarioCriseResponse.from(cenario);
    }

    @Transactional
    public void deactivate(Long id) {
        CenarioCrise cenario = getOrThrow(id);
        cenario.active = false;
    }

    private CenarioCrise getOrThrow(Long id) {
        return cenarioCriseRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Cenário de crise não encontrado: " + id));
    }
}
