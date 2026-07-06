package br.com.crisismanagement.dto;

import java.time.LocalDateTime;

import br.com.crisismanagement.entities.Crise;
import br.com.crisismanagement.entities.enums.NivelCriticidade;
import br.com.crisismanagement.entities.enums.StatusCrise;

public record CriseResponse(
        Long id,
        String titulo,
        String descricao,
        StatusCrise status,
        NivelCriticidade nivel,
        Long tipoCriseId,
        Long campusId,
        Long cenarioId,
        Long departamentoId,
        boolean active,
        LocalDateTime createdAt) {

    public static CriseResponse from(Crise crise) {
        return new CriseResponse(
                crise.id,
                crise.titulo,
                crise.descricao,
                crise.status,
                crise.nivel,
                crise.tipoCriseId,
                crise.campusId,
                crise.cenarioId,
                crise.departamentoId,
                crise.active,
                crise.createdAt);
    }
}
