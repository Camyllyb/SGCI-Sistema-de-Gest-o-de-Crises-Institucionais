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
        Long createdBy,
        String createdByName,
        boolean active,
        LocalDateTime createdAt) {

    /** Projecao sem o nome do responsavel resolvido (usado quando ele nao e necessario). */
    public static CriseResponse from(Crise crise) {
        return from(crise, null);
    }

    /** Projecao com o nome do responsavel (criador) ja resolvido. */
    public static CriseResponse from(Crise crise, String createdByName) {
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
                crise.createdBy,
                createdByName,
                crise.active,
                crise.createdAt);
    }
}
