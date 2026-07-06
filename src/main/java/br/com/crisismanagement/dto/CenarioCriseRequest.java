package br.com.crisismanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CenarioCriseRequest(
        @NotBlank(message = "A descrição é obrigatória")
        @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres")
        String descricao,

        @Size(max = 50, message = "O nível sugerido deve ter no máximo 50 caracteres")
        String nivelSugerido,

        @NotNull(message = "O tipo de crise é obrigatório")
        Long tipoCriseId,

        @NotNull(message = "O departamento é obrigatório")
        Long departamentoId) {
}
