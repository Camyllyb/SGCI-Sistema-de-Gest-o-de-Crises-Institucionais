package br.com.crisismanagement.exceptions;

import java.sql.SQLException;

import org.hibernate.exception.ConstraintViolationException;
import org.jboss.logging.Logger;

import br.com.crisismanagement.dto.ErrorResponse;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

/**
 * Converte violações de integridade do banco (chave estrangeira inexistente,
 * valor duplicado em coluna única, etc.) em respostas HTTP limpas — 400/409 com
 * mensagem amigável — em vez de um 500 com stack trace vazado.
 *
 * <p>Trata {@link org.hibernate.exception.ConstraintViolationException} (nível
 * de banco), <b>não</b> a {@code jakarta.validation.ConstraintViolationException}
 * de Bean Validation, que continua sendo tratada pelo mapper embutido do
 * RESTEasy (formato {@code {"title":"Constraint Violation","violations":[...]}}).
 */
@Provider
public class ConstraintViolationExceptionMapper implements ExceptionMapper<ConstraintViolationException> {

    private static final Logger LOG = Logger.getLogger(ConstraintViolationExceptionMapper.class);

    @Override
    public Response toResponse(ConstraintViolationException exception) {
        String sqlState = null;
        SQLException sql = exception.getSQLException();
        if (sql != null) {
            sqlState = sql.getSQLState();
        }
        LOG.warnf("Violação de integridade (SQLState=%s, constraint=%s): %s",
                sqlState, exception.getConstraintName(), exception.getMessage());

        Response.Status status;
        String message;
        switch (sqlState == null ? "" : sqlState) {
            case "23505" -> { // unique_violation
                status = Response.Status.CONFLICT;
                message = "Já existe um registro com esses dados.";
            }
            case "23503" -> { // foreign_key_violation
                status = Response.Status.BAD_REQUEST;
                message = "Uma das referências informadas não existe ou está em uso.";
            }
            case "23502" -> { // not_null_violation
                status = Response.Status.BAD_REQUEST;
                message = "Um campo obrigatório não foi informado.";
            }
            default -> {
                status = Response.Status.CONFLICT;
                message = "A operação viola uma restrição de integridade dos dados.";
            }
        }
        return Response.status(status)
                .type(MediaType.APPLICATION_JSON)
                .entity(new ErrorResponse(message))
                .build();
    }
}
