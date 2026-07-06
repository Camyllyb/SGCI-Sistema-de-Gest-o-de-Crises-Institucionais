package br.com.crisismanagement.controllers;

import java.util.List;

import br.com.crisismanagement.dto.InstituicaoRequest;
import br.com.crisismanagement.dto.InstituicaoResponse;
import br.com.crisismanagement.services.InstituicaoService;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/instituicoes")
@Authenticated
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class InstituicaoController {

    @Inject
    InstituicaoService instituicaoService;

    @GET
    public List<InstituicaoResponse> listAll() {
        return instituicaoService.listAll();
    }

    @GET
    @Path("/{id}")
    public InstituicaoResponse findById(@PathParam("id") Long id) {
        return instituicaoService.findById(id);
    }

    @POST
    @RolesAllowed("ADMIN")
    public Response create(@Valid InstituicaoRequest request) {
        InstituicaoResponse created = instituicaoService.create(request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public InstituicaoResponse update(@PathParam("id") Long id, @Valid InstituicaoRequest request) {
        return instituicaoService.update(id, request);
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response deactivate(@PathParam("id") Long id) {
        instituicaoService.deactivate(id);
        return Response.noContent().build();
    }
}
