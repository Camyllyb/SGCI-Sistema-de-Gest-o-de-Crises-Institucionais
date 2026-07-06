package br.com.crisismanagement.exceptions;

import br.com.crisismanagement.dto.ErrorResponse;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

/**
 * Garante que a mensagem das exceções de negócio (ex.:
 * {@code new BadRequestException("Não é possível...")},
 * {@code new NotFoundException("Crise não encontrada")}) chegue ao cliente.
 *
 * <p>Por padrão o RESTEasy Reactive descarta a mensagem dessas exceções e
 * devolve um corpo vazio; aqui reempacotamos em {@code {"message": "..."}},
 * preservando o status HTTP original. Respostas que já trazem corpo (mappers
 * mais específicos, como o de credenciais) são mantidas intactas.
 */
@Provider
public class WebApplicationExceptionMapper implements ExceptionMapper<WebApplicationException> {

    @Override
    public Response toResponse(WebApplicationException exception) {
        Response original = exception.getResponse();
        int status = original != null ? original.getStatus() : Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();

        // Não sobrescreve respostas que já possuem corpo próprio.
        if (original != null && original.hasEntity()) {
            return original;
        }

        String message = exception.getMessage();
        if (message == null || message.isBlank() || message.startsWith("HTTP ")) {
            message = defaultMessage(status);
        }
        return Response.status(status)
                .type(MediaType.APPLICATION_JSON)
                .entity(new ErrorResponse(message))
                .build();
    }

    private String defaultMessage(int status) {
        return switch (status) {
            case 400 -> "Requisição inválida.";
            case 403 -> "Você não tem permissão para executar esta ação.";
            case 404 -> "Registro não encontrado.";
            case 409 -> "Conflito com o estado atual do recurso.";
            default -> "Não foi possível processar a requisição.";
        };
    }
}
