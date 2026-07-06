package br.com.crisismanagement.dto;

import br.com.crisismanagement.entities.enums.NivelCriticidade;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CriseRequest(
        @NotBlank(message = "O título é obrigatório")
        @Size(max = 200, message = "O título deve ter no máximo 200 caracteres")
        String titulo,

        @NotBlank(message = "A descrição é obrigatória")
        @Size(max = 1000, message = "A descrição deve ter no máximo 1000 caracteres")
        String descricao,

        @NotNull(message = "O nível de criticidade é obrigatório")
        NivelCriticidade nivel,

        @NotNull(message = "O tipo de crise é obrigatório")
        Long tipoCriseId,

        @NotNull(message = "O campus é obrigatório")
        Long campusId,

        Long cenarioId,

        @NotNull(message = "O departamento é obrigatório")
        Long departamentoId) {
}
