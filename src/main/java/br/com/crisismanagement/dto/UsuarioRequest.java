package br.com.crisismanagement.dto;

import br.com.crisismanagement.entities.enums.PerfilUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Payload de criação/edição de usuário. A senha é obrigatória na criação e
 * opcional na edição (nula/em branco mantém a senha atual) — regra aplicada
 * no BO ({@code UsuarioService}). O campo {@code active} é opcional; nulo
 * equivale a ativo na criação.
 */
public record UsuarioRequest(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 150, message = "O nome deve ter no máximo 150 caracteres")
        String name,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "E-mail inválido")
        @Size(max = 150, message = "O e-mail deve ter no máximo 150 caracteres")
        String email,

        @Size(min = 6, max = 100, message = "A senha deve ter entre 6 e 100 caracteres")
        String password,

        @NotNull(message = "O perfil é obrigatório")
        PerfilUsuario perfil,

        Long departamentoId,

        Boolean active) {
}
