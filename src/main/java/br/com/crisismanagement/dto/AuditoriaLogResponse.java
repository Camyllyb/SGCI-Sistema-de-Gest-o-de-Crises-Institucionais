package br.com.crisismanagement.dto;

import java.time.LocalDateTime;

import br.com.crisismanagement.entities.AuditoriaLog;

public record AuditoriaLogResponse(
        Long id,
        Long usuarioId,
        String usuarioNome,
        String acao,
        String metodoHttp,
        String entidadeAfetada,
        String recurso,
        int statusResposta,
        LocalDateTime dataHora) {

    public static AuditoriaLogResponse from(AuditoriaLog log) {
        return new AuditoriaLogResponse(
                log.id,
                log.usuarioId,
                log.usuarioNome,
                log.acao,
                log.metodoHttp,
                log.entidadeAfetada,
                log.recurso,
                log.statusResposta,
                log.dataHora);
    }
}
