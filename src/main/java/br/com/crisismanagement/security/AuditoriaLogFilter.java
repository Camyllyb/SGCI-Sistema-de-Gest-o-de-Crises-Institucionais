package br.com.crisismanagement.security;

import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.logging.Logger;

import br.com.crisismanagement.services.AuditoriaService;
import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;

/**
 * Interceptor JAX-RS que registra, na auditoria, toda ação de modificação
 * (POST, PUT, PATCH, DELETE) executada por um usuário autenticado. Roda como
 * {@link ContainerResponseFilter} para também capturar o status HTTP da
 * resposta. Requisições anônimas (ex.: login) e chamadas às próprias rotas de
 * autenticação/auditoria são ignoradas.
 */
@Provider
public class AuditoriaLogFilter implements ContainerResponseFilter {

    private static final Logger LOG = Logger.getLogger(AuditoriaLogFilter.class);

    @Inject
    JsonWebToken jwt;

    @Inject
    AuditoriaService auditoriaService;

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
        String metodo = requestContext.getMethod();
        if (!isModificacao(metodo)) {
            return;
        }

        String subject = jwt.getSubject();
        if (subject == null || subject.isBlank()) {
            return; // ação anônima (ex.: login) não é auditada
        }

        String path = normalize(requestContext.getUriInfo().getPath());
        String entidade = extrairEntidade(path);
        if ("auth".equals(entidade) || "auditoria".equals(entidade)) {
            return; // evita ruído e auto-referência
        }

        try {
            auditoriaService.registrar(
                    Long.valueOf(subject),
                    nomeDoToken(subject),
                    acaoDe(metodo),
                    metodo,
                    entidade,
                    "/" + path,
                    responseContext.getStatus());
        } catch (RuntimeException e) {
            // Auditoria nunca deve interromper a requisição original.
            LOG.warnf(e, "Falha ao registrar auditoria para %s /%s", metodo, path);
        }
    }

    private boolean isModificacao(String metodo) {
        return "POST".equals(metodo) || "PUT".equals(metodo)
                || "PATCH".equals(metodo) || "DELETE".equals(metodo);
    }

    private String acaoDe(String metodo) {
        return switch (metodo) {
            case "POST" -> "CRIAR";
            case "PUT", "PATCH" -> "ATUALIZAR";
            case "DELETE" -> "EXCLUIR";
            default -> metodo;
        };
    }

    private String normalize(String path) {
        if (path == null || path.isBlank()) {
            return "";
        }
        return path.startsWith("/") ? path.substring(1) : path;
    }

    private String extrairEntidade(String path) {
        String[] segments = path.split("/");
        for (int i = 0; i < segments.length; i++) {
            if ("api".equals(segments[i]) && i + 1 < segments.length && !segments[i + 1].isBlank()) {
                return segments[i + 1];
            }
        }
        for (String segment : segments) {
            if (!segment.isBlank()) {
                return segment;
            }
        }
        return "desconhecido";
    }

    private String nomeDoToken(String fallback) {
        Object name = jwt.getClaim("name");
        return name != null ? name.toString() : fallback;
    }
}
