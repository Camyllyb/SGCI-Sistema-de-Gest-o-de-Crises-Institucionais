package br.com.crisismanagement.dto;

import java.time.LocalDateTime;

import br.com.crisismanagement.entities.RelatorioCrise;

public record RelatorioCriseResponse(
        Long id,
        String titulo,
        String resumoOcorrido,
        String impactosIdentificados,
        String acoesRealizadas,
        String resultadoFinal,
        String recomendacoes,
        Long criseId,
        Long usuarioId,
        LocalDateTime createdAt) {

    public static RelatorioCriseResponse from(RelatorioCrise relatorio) {
        return new RelatorioCriseResponse(
                relatorio.id,
                relatorio.titulo,
                relatorio.resumoOcorrido,
                relatorio.impactosIdentificados,
                relatorio.acoesRealizadas,
                relatorio.resultadoFinal,
                relatorio.recomendacoes,
                relatorio.criseId,
                relatorio.usuarioId,
                relatorio.createdAt);
    }
}
