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
        LocalDateTime createdAt) {

    public static AcaoCriseResponse from(AcaoCrise acao) {
        return new AcaoCriseResponse(
                acao.id,
                acao.descricao,
                acao.tipo,
                acao.criseId,
                acao.usuarioId,
                acao.createdAt);
    }
}
