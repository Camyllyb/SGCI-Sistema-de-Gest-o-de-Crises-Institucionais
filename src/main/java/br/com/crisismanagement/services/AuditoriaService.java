package br.com.crisismanagement.services;

import java.time.LocalDateTime;
import java.util.List;

import br.com.crisismanagement.dto.AuditoriaFacetsResponse;
import br.com.crisismanagement.dto.AuditoriaLogResponse;
import br.com.crisismanagement.entities.AuditoriaLog;
import br.com.crisismanagement.repositories.AuditoriaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

/**
 * BO (Business Object) da auditoria: concentra as regras de negócio de
 * registro e consulta de logs. O acesso a dados é delegado ao DAO
 * {@link AuditoriaRepository}.
 */
@ApplicationScoped
public class AuditoriaService {

    @Inject
    AuditoriaRepository auditoriaRepository;

    /**
     * Persiste um registro de auditoria em transação própria
     * ({@code REQUIRES_NEW}), pois o filtro de resposta que a invoca roda após
     * a transação da requisição original já ter sido encerrada.
     */
    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public void registrar(Long usuarioId, String usuarioNome, String acao, String metodoHttp,
                          String entidadeAfetada, String recurso, int statusResposta) {
        AuditoriaLog log = new AuditoriaLog();
        log.usuarioId = usuarioId;
        log.usuarioNome = truncate(usuarioNome, 150);
        log.acao = truncate(acao, 30);
        log.metodoHttp = truncate(metodoHttp, 10);
        log.entidadeAfetada = truncate(entidadeAfetada, 100);
        log.recurso = truncate(recurso, 255);
        log.statusResposta = statusResposta;
        log.dataHora = LocalDateTime.now();
        auditoriaRepository.persist(log);
    }

    public List<AuditoriaLogResponse> buscar(String entidade, String acao, String usuario) {
        return auditoriaRepository.search(entidade, acao, usuario).stream()
                .map(AuditoriaLogResponse::from)
                .toList();
    }

    public AuditoriaFacetsResponse facets() {
        return new AuditoriaFacetsResponse(
                auditoriaRepository.distinctEntidades(),
                auditoriaRepository.distinctAcoes(),
                auditoriaRepository.distinctUsuarios());
    }

    private String truncate(String value, int max) {
        if (value == null) {
            return null;
        }
        return value.length() <= max ? value : value.substring(0, max);
    }
}
