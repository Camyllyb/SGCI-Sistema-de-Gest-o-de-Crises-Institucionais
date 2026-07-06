package br.com.crisismanagement.controllers;

import java.util.List;

import br.com.crisismanagement.dto.TipoCriseRequest;
import br.com.crisismanagement.dto.TipoCriseResponse;
import br.com.crisismanagement.services.TipoCriseService;
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

@Path("/api/tipos-crise")
@Authenticated
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class TipoCriseController {

    @Inject
    TipoCriseService tipoCriseService;

    @GET
    public List<TipoCriseResponse> listAll() {
        return tipoCriseService.listAll();
    }

    @GET
    @Path("/{id}")
    public TipoCriseResponse findById(@PathParam("id") Long id) {
        return tipoCriseService.findById(id);
    }

    @POST
    @RolesAllowed("ADMIN")
    public Response create(@Valid TipoCriseRequest request) {
        TipoCriseResponse created = tipoCriseService.create(request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public TipoCriseResponse update(@PathParam("id") Long id, @Valid TipoCriseRequest request) {
        return tipoCriseService.update(id, request);
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response deactivate(@PathParam("id") Long id) {
        tipoCriseService.deactivate(id);
        return Response.noContent().build();
    }
}
