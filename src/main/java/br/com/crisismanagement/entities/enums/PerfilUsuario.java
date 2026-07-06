package br.com.crisismanagement.entities.enums;

/**
 * Perfis de acesso do sistema. O nome do enum é usado como "role" (claim
 * {@code groups} do JWT) para as verificações de {@code @RolesAllowed}.
 */
public enum PerfilUsuario {
    ADMIN,
    COMUM
}
