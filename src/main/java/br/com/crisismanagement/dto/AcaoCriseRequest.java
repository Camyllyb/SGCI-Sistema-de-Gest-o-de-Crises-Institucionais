package br.com.crisismanagement.dto;

import br.com.crisismanagement.entities.enums.TipoAcao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AcaoCriseRequest(
        @NotBlank(message = "A descrição é obrigatória")
        @Size(max = 1000, message = "A descrição deve ter no máximo 1000 caracteres")
        String descricao,

        @NotNull(message = "O tipo de ação é obrigatório")
        TipoAcao tipo) {
}
