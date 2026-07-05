package br.com.crisismanagement.dto;

public record LoginResponse(boolean authenticated, String message) {
}
