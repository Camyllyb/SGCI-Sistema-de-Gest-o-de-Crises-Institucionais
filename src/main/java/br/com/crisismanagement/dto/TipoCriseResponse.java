package br.com.crisismanagement.dto;

import java.time.LocalDateTime;

import br.com.crisismanagement.entities.TipoCrise;

public record TipoCriseResponse(
        Long id,
        String nome,
        String descricao,
        boolean active,
        LocalDateTime createdAt) {

    public static TipoCriseResponse from(TipoCrise tipoCrise) {
        return new TipoCriseResponse(
                tipoCrise.id,
                tipoCrise.nome,
                tipoCrise.descricao,
                tipoCrise.active,
                tipoCrise.createdAt);
    }
}
