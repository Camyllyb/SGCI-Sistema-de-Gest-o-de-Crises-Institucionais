package br.com.crisismanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Redefinição de senha a partir do token recebido por e-mail. */
public record ResetPasswordRequest(
        @NotBlank(message = "O token é obrigatório")
        String token,

        @NotBlank(message = "A nova senha é obrigatória")
        @Size(min = 8, max = 100, message = "A nova senha deve ter entre 8 e 100 caracteres")
        String newPassword) {
}
