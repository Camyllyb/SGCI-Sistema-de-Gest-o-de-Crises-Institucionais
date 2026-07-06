package br.com.crisismanagement.dto;

import java.time.LocalDateTime;

import br.com.crisismanagement.entities.Campus;

public record CampusResponse(
        Long id,
        String nome,
        Long instituicaoId,
        boolean active,
        LocalDateTime createdAt) {

    public static CampusResponse from(Campus campus) {
        return new CampusResponse(
                campus.id,
                campus.nome,
                campus.instituicaoId,
                campus.active,
                campus.createdAt);
    }
}
