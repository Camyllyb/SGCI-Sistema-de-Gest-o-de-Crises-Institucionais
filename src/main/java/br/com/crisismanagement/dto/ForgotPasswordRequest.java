package br.com.crisismanagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** Solicitação de recuperação de senha ("Esqueci minha senha"). */
public record ForgotPasswordRequest(
        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "E-mail inválido")
        String email) {
}
