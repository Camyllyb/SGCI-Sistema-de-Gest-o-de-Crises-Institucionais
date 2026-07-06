package br.com.crisismanagement.services;

import java.time.LocalDateTime;
import java.util.List;

import org.eclipse.microprofile.jwt.JsonWebToken;

import br.com.crisismanagement.dto.RelatorioCriseRequest;
import br.com.crisismanagement.dto.RelatorioCriseResponse;
import br.com.crisismanagement.entities.Crise;
import br.com.crisismanagement.entities.RelatorioCrise;
import br.com.crisismanagement.entities.enums.StatusCrise;
import br.com.crisismanagement.repositories.CriseRepository;
import br.com.crisismanagement.repositories.RelatorioCriseRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class RelatorioCriseService {

    @Inject
    RelatorioCriseRepository relatorioCriseRepository;

    @Inject
    CriseRepository criseRepository;

    @Inject
    JsonWebToken jsonWebToken;

    public List<RelatorioCriseResponse> listAll() {
        return relatorioCriseRepository.listAllOrdered().stream()
                .map(RelatorioCriseResponse::from)
                .toList();
    }

    public RelatorioCriseResponse findById(Long id) {
        return RelatorioCriseResponse.from(getOrThrow(id));
    }

    @Transactional
    public RelatorioCriseResponse create(RelatorioCriseRequest request) {
        Crise crise = criseRepository.findByIdOptional(request.criseId())
                .orElseThrow(() -> new NotFoundException("Crise não encontrada: " + request.criseId()));

        if (crise.status != StatusCrise.RESOLVIDA && crise.status != StatusCrise.ENCERRADA) {
            throw new BadRequestException("Só é possível gerar relatório de crises RESOLVIDAS ou ENCERRADAS.");
        }

        if (relatorioCriseRepository.existsByCrise(crise.id)) {
            throw new BadRequestException("Esta crise já possui um relatório.");
        }

        RelatorioCrise relatorio = new RelatorioCrise();
        relatorio.titulo = request.titulo();
        relatorio.resumoOcorrido = request.resumoOcorrido();
        relatorio.impactosIdentificados = request.impactosIdentificados();
        relatorio.acoesRealizadas = request.acoesRealizadas();
        relatorio.resultadoFinal = request.resultadoFinal();
        relatorio.recomendacoes = request.recomendacoes();
        relatorio.criseId = crise.id;
        relatorio.usuarioId = Long.valueOf(jsonWebToken.getSubject());
        relatorio.createdAt = LocalDateTime.now();
        relatorioCriseRepository.persist(relatorio);
        return RelatorioCriseResponse.from(relatorio);
    }

    private RelatorioCrise getOrThrow(Long id) {
        return relatorioCriseRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Relatório não encontrado: " + id));
    }
}
