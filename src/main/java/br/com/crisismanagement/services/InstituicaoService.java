package br.com.crisismanagement.services;

import java.time.LocalDateTime;
import java.util.List;

import br.com.crisismanagement.dto.InstituicaoRequest;
import br.com.crisismanagement.dto.InstituicaoResponse;
import br.com.crisismanagement.entities.Instituicao;
import br.com.crisismanagement.repositories.InstituicaoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class InstituicaoService {

    @Inject
    InstituicaoRepository instituicaoRepository;

    public List<InstituicaoResponse> listAll() {
        return instituicaoRepository.listAllOrdered().stream()
                .map(InstituicaoResponse::from)
                .toList();
    }

    public InstituicaoResponse findById(Long id) {
        return InstituicaoResponse.from(getOrThrow(id));
    }

    @Transactional
    public InstituicaoResponse create(InstituicaoRequest request) {
        Instituicao instituicao = new Instituicao();
        instituicao.nome = request.nome();
        instituicao.sigla = request.sigla();
        instituicao.active = true;
        instituicao.createdAt = LocalDateTime.now();
        instituicaoRepository.persist(instituicao);
        return InstituicaoResponse.from(instituicao);
    }

    @Transactional
    public InstituicaoResponse update(Long id, InstituicaoRequest request) {
        Instituicao instituicao = getOrThrow(id);
        instituicao.nome = request.nome();
        instituicao.sigla = request.sigla();
        return InstituicaoResponse.from(instituicao);
    }

    @Transactional
    public void deactivate(Long id) {
        Instituicao instituicao = getOrThrow(id);
        instituicao.active = false;
    }

    private Instituicao getOrThrow(Long id) {
        return instituicaoRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Instituição não encontrada: " + id));
    }
}
