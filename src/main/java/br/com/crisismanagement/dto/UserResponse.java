package br.com.crisismanagement.dto;

import br.com.crisismanagement.entities.enums.PerfilUsuario;

public record UserResponse(Long id, String name, String email, PerfilUsuario perfil, boolean mustChangePassword) {
}
