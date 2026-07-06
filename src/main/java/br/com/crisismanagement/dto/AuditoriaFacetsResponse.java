package br.com.crisismanagement.dto;

import java.util.List;

/** Valores distintos usados para popular os filtros da tela de auditoria. */
public record AuditoriaFacetsResponse(
        List<String> entidades,
        List<String> acoes,
        List<String> usuarios) {
}
