package br.com.crisismanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Troca de senha do usuário autenticado. */
public record ChangePasswordRequest(
        @NotBlank(message = "A senha atual é obrigatória")
        String currentPassword,

        @NotBlank(message = "A nova senha é obrigatória")
        @Size(min = 8, max = 100, message = "A nova senha deve ter entre 8 e 100 caracteres")
        String newPassword) {
}
