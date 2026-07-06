package br.com.crisismanagement.services;

import java.time.LocalDateTime;
import java.util.List;

import br.com.crisismanagement.dto.TipoCriseRequest;
import br.com.crisismanagement.dto.TipoCriseResponse;
import br.com.crisismanagement.entities.TipoCrise;
import br.com.crisismanagement.repositories.TipoCriseRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class TipoCriseService {

    @Inject
    TipoCriseRepository tipoCriseRepository;

    public List<TipoCriseResponse> listAll() {
        return tipoCriseRepository.listAllOrdered().stream()
                .map(TipoCriseResponse::from)
                .toList();
    }

    public TipoCriseResponse findById(Long id) {
        return TipoCriseResponse.from(getOrThrow(id));
    }

    @Transactional
    public TipoCriseResponse create(TipoCriseRequest request) {
        TipoCrise tipoCrise = new TipoCrise();
        tipoCrise.nome = request.nome();
        tipoCrise.descricao = request.descricao();
        tipoCrise.active = true;
        tipoCrise.createdAt = LocalDateTime.now();
        tipoCriseRepository.persist(tipoCrise);
        return TipoCriseResponse.from(tipoCrise);
    }

    @Transactional
    public TipoCriseResponse update(Long id, TipoCriseRequest request) {
        TipoCrise tipoCrise = getOrThrow(id);
        tipoCrise.nome = request.nome();
        tipoCrise.descricao = request.descricao();
        return TipoCriseResponse.from(tipoCrise);
    }

    @Transactional
    public void deactivate(Long id) {
        TipoCrise tipoCrise = getOrThrow(id);
        tipoCrise.active = false;
    }

    private TipoCrise getOrThrow(Long id) {
        return tipoCriseRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Tipo de crise não encontrado: " + id));
    }
}
