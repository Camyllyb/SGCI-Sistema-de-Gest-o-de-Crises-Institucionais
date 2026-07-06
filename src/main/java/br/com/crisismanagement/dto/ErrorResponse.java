package br.com.crisismanagement.dto;

/**
 * Corpo padrão de erro da API. Uniformiza a forma como o frontend lê mensagens
 * de erro: sempre em {@code {"message": "..."}}.
 */
public record ErrorResponse(String message) {
}
