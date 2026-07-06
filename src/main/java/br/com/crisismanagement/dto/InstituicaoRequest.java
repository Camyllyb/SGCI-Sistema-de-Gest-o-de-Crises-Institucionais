package br.com.crisismanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record InstituicaoRequest(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 150, message = "O nome deve ter no máximo 150 caracteres")
        String nome,

        @NotBlank(message = "A sigla é obrigatória")
        @Size(max = 20, message = "A sigla deve ter no máximo 20 caracteres")
        String sigla) {
}
