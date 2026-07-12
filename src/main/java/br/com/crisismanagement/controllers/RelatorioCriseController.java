package br.com.crisismanagement.controllers;

import java.util.List;

import br.com.crisismanagement.dto.RelatorioCriseRequest;
import br.com.crisismanagement.dto.RelatorioCriseResponse;
import br.com.crisismanagement.services.RelatorioCriseService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/** Relatórios são exclusivos do perfil ADMIN (leitura e criação). */
@Path("/api/relatorios")
@RolesAllowed("ADMIN")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class RelatorioCriseController {

    @Inject
    RelatorioCriseService relatorioCriseService;

    @GET
    public List<RelatorioCriseResponse> listAll() {
        return relatorioCriseService.listAll();
    }

    @GET
    @Path("/{id}")
    public RelatorioCriseResponse findById(@PathParam("id") Long id) {
        return relatorioCriseService.findById(id);
    }

    @POST
    @RolesAllowed("ADMIN")
    public Response create(@Valid RelatorioCriseRequest request) {
        RelatorioCriseResponse created = relatorioCriseService.create(request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }
}
