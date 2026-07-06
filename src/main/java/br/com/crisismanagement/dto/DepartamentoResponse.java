package br.com.crisismanagement.dto;

import java.time.LocalDateTime;

import br.com.crisismanagement.entities.Departamento;

public record DepartamentoResponse(
        Long id,
        String nome,
        String sigla,
        boolean active,
        LocalDateTime createdAt) {

    public static DepartamentoResponse from(Departamento departamento) {
        return new DepartamentoResponse(
                departamento.id,
                departamento.nome,
                departamento.sigla,
                departamento.active,
                departamento.createdAt);
    }
}
