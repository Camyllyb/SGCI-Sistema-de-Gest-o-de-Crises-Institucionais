package br.com.crisismanagement.dto;

import java.time.LocalDateTime;

import br.com.crisismanagement.entities.Instituicao;

public record InstituicaoResponse(
        Long id,
        String nome,
        String sigla,
        boolean active,
        LocalDateTime createdAt) {

    public static InstituicaoResponse from(Instituicao instituicao) {
        return new InstituicaoResponse(
                instituicao.id,
                instituicao.nome,
                instituicao.sigla,
                instituicao.active,
                instituicao.createdAt);
    }
}
