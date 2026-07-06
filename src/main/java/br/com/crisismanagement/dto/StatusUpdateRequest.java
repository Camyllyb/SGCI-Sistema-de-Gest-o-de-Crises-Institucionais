package br.com.crisismanagement.dto;

import br.com.crisismanagement.entities.enums.StatusCrise;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(
        @NotNull(message = "O status é obrigatório")
        StatusCrise status) {
}
