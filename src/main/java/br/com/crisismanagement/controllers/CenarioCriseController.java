package br.com.crisismanagement.controllers;

import java.util.List;

import br.com.crisismanagement.dto.CenarioCriseRequest;
import br.com.crisismanagement.dto.CenarioCriseResponse;
import br.com.crisismanagement.services.CenarioCriseService;
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

@Path("/api/cenarios")
@Authenticated
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CenarioCriseController {

    @Inject
    CenarioCriseService cenarioCriseService;

    @GET
    public List<CenarioCriseResponse> listAll() {
        return cenarioCriseService.listAll();
    }

    @GET
    @Path("/{id}")
    public CenarioCriseResponse findById(@PathParam("id") Long id) {
        return cenarioCriseService.findById(id);
    }

    @POST
    @RolesAllowed("ADMIN")
    public Response create(@Valid CenarioCriseRequest request) {
        CenarioCriseResponse created = cenarioCriseService.create(request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public CenarioCriseResponse update(@PathParam("id") Long id, @Valid CenarioCriseRequest request) {
        return cenarioCriseService.update(id, request);
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response deactivate(@PathParam("id") Long id) {
        cenarioCriseService.deactivate(id);
        return Response.noContent().build();
    }
}
