package br.com.crisismanagement.dto;

import java.time.LocalDateTime;

import br.com.crisismanagement.entities.AcaoCrise;
import br.com.crisismanagement.entities.enums.TipoAcao;

public record AcaoCriseResponse(
        Long id,
        String descricao,
        TipoAcao tipo,
        Long criseId,
        Long usuarioId,
        String usuarioNome,
        LocalDateTime createdAt) {

    public static AcaoCriseResponse from(AcaoCrise acao) {
        return from(acao, null);
    }

    public static AcaoCriseResponse from(AcaoCrise acao, String usuarioNome) {
        return new AcaoCriseResponse(
                acao.id,
                acao.descricao,
                acao.tipo,
                acao.criseId,
                acao.usuarioId,
                usuarioNome,
                acao.createdAt);
    }
}
