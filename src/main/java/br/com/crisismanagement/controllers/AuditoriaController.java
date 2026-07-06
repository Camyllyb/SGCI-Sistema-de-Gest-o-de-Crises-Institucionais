package br.com.crisismanagement.controllers;

import java.util.List;

import br.com.crisismanagement.dto.AuditoriaFacetsResponse;
import br.com.crisismanagement.dto.AuditoriaLogResponse;
import br.com.crisismanagement.services.AuditoriaService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

/** Consulta dos registros de auditoria — restrito ao perfil ADMIN. */
@Path("/api/auditoria")
@RolesAllowed("ADMIN")
@Produces(MediaType.APPLICATION_JSON)
public class AuditoriaController {

    @Inject
    AuditoriaService auditoriaService;

    @GET
    public List<AuditoriaLogResponse> listAll(
            @QueryParam("entidade") String entidade,
            @QueryParam("acao") String acao,
            @QueryParam("usuario") String usuario) {
        return auditoriaService.buscar(entidade, acao, usuario);
    }

    @GET
    @Path("/facets")
    public AuditoriaFacetsResponse facets() {
        return auditoriaService.facets();
    }
}
