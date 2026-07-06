package br.com.crisismanagement.services;

import br.com.crisismanagement.dto.DashboardResponse;
import br.com.crisismanagement.entities.enums.NivelCriticidade;
import br.com.crisismanagement.entities.enums.StatusCrise;
import br.com.crisismanagement.repositories.CriseRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class DashboardService {

    @Inject
    CriseRepository criseRepository;

    public DashboardResponse resumo() {
        return new DashboardResponse(
                criseRepository.count(),
                criseRepository.countByStatus(StatusCrise.ABERTA),
                criseRepository.countByStatus(StatusCrise.EM_ANDAMENTO),
                criseRepository.countByStatus(StatusCrise.RESOLVIDA),
                criseRepository.countByNivel(NivelCriticidade.CRITICO));
    }
}
