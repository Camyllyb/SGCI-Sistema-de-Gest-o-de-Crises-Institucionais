package br.com.crisismanagement.dto;

import java.time.LocalDateTime;

import br.com.crisismanagement.entities.User;
import br.com.crisismanagement.entities.enums.PerfilUsuario;

/** Projeção de usuário para o painel administrativo (nunca expõe a senha). */
public record UsuarioResponse(
        Long id,
        String name,
        String email,
        PerfilUsuario perfil,
        Long departamentoId,
        Long instituicaoId,
        String cargo,
        boolean active,
        boolean mustChangePassword,
        LocalDateTime createdAt) {

    public static UsuarioResponse from(User user) {
        return new UsuarioResponse(
                user.id,
                user.name,
                user.email,
                user.perfil,
                user.departamentoId,
                user.instituicaoId,
                user.cargo,
                user.active,
                user.mustChangePassword,
                user.createdAt);
    }
}
