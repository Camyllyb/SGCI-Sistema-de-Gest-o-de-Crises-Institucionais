package br.com.crisismanagement.dto;

public record DashboardResponse(
        long totalCrises,
        long crisesAbertas,
        long crisesEmAndamento,
        long crisesResolvidas,
        long crisesCriticas) {
}
