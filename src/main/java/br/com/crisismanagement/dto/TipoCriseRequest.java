package br.com.crisismanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TipoCriseRequest(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 150, message = "O nome deve ter no máximo 150 caracteres")
        String nome,

        @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres")
        String descricao) {
}
