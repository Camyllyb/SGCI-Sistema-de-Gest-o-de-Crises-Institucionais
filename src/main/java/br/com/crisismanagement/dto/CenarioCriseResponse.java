package br.com.crisismanagement.dto;

import java.time.LocalDateTime;

import br.com.crisismanagement.entities.CenarioCrise;

public record CenarioCriseResponse(
        Long id,
        String descricao,
        String nivelSugerido,
        Long tipoCriseId,
        Long departamentoId,
        boolean active,
        LocalDateTime createdAt) {

    public static CenarioCriseResponse from(CenarioCrise cenario) {
        return new CenarioCriseResponse(
                cenario.id,
                cenario.descricao,
                cenario.nivelSugerido,
                cenario.tipoCriseId,
                cenario.departamentoId,
                cenario.active,
                cenario.createdAt);
    }
}
