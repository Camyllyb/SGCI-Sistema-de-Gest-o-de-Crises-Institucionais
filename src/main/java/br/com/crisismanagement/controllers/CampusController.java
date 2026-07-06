package br.com.crisismanagement.controllers;

import java.util.List;

import br.com.crisismanagement.dto.CampusRequest;
import br.com.crisismanagement.dto.CampusResponse;
import br.com.crisismanagement.services.CampusService;
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

@Path("/api/campi")
@Authenticated
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CampusController {

    @Inject
    CampusService campusService;

    @GET
    public List<CampusResponse> listAll() {
        return campusService.listAll();
    }

    @GET
    @Path("/{id}")
    public CampusResponse findById(@PathParam("id") Long id) {
        return campusService.findById(id);
    }

    @POST
    @RolesAllowed("ADMIN")
    public Response create(@Valid CampusRequest request) {
        CampusResponse created = campusService.create(request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public CampusResponse update(@PathParam("id") Long id, @Valid CampusRequest request) {
        return campusService.update(id, request);
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response deactivate(@PathParam("id") Long id) {
        campusService.deactivate(id);
        return Response.noContent().build();
    }
}
