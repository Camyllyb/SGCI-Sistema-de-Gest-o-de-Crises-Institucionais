package br.com.crisismanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RelatorioCriseRequest(
        @NotBlank(message = "O título é obrigatório")
        @Size(max = 200, message = "O título deve ter no máximo 200 caracteres")
        String titulo,

        @NotBlank(message = "O resumo do ocorrido é obrigatório")
        @Size(max = 2000, message = "O resumo deve ter no máximo 2000 caracteres")
        String resumoOcorrido,

        @Size(max = 2000, message = "Os impactos devem ter no máximo 2000 caracteres")
        String impactosIdentificados,

        @Size(max = 2000, message = "As ações devem ter no máximo 2000 caracteres")
        String acoesRealizadas,

        @Size(max = 2000, message = "O resultado final deve ter no máximo 2000 caracteres")
        String resultadoFinal,

        @Size(max = 2000, message = "As recomendações devem ter no máximo 2000 caracteres")
        String recomendacoes,

        @NotNull(message = "A crise é obrigatória")
        Long criseId) {
}
