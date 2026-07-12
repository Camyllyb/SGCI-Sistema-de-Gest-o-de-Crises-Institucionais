package br.com.crisismanagement.dto;

import br.com.crisismanagement.entities.enums.PerfilUsuario;

/**
 * Projeção da página "Meu Perfil": dados cadastrais do usuário autenticado com
 * os nomes de departamento e instituição já resolvidos. Nunca expõe a senha.
 */
public record ProfileResponse(
        Long id,
        String name,
        String email,
        PerfilUsuario perfil,
        String cargo,
        Long departamentoId,
        String departamentoNome,
        Long instituicaoId,
        String instituicaoNome) {
}
