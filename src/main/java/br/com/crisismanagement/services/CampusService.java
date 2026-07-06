package br.com.crisismanagement.services;

import java.time.LocalDateTime;
import java.util.List;

import br.com.crisismanagement.dto.CampusRequest;
import br.com.crisismanagement.dto.CampusResponse;
import br.com.crisismanagement.entities.Campus;
import br.com.crisismanagement.repositories.CampusRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class CampusService {

    @Inject
    CampusRepository campusRepository;

    public List<CampusResponse> listAll() {
        return campusRepository.listAllOrdered().stream()
                .map(CampusResponse::from)
                .toList();
    }

    public CampusResponse findById(Long id) {
        return CampusResponse.from(getOrThrow(id));
    }

    @Transactional
    public CampusResponse create(CampusRequest request) {
        Campus campus = new Campus();
        campus.nome = request.nome();
        campus.instituicaoId = request.instituicaoId();
        campus.active = true;
        campus.createdAt = LocalDateTime.now();
        campusRepository.persist(campus);
        return CampusResponse.from(campus);
    }

    @Transactional
    public CampusResponse update(Long id, CampusRequest request) {
        Campus campus = getOrThrow(id);
        campus.nome = request.nome();
        campus.instituicaoId = request.instituicaoId();
        return CampusResponse.from(campus);
    }

    @Transactional
    public void deactivate(Long id) {
        Campus campus = getOrThrow(id);
        campus.active = false;
    }

    private Campus getOrThrow(Long id) {
        return campusRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Campus não encontrado: " + id));
    }
}
