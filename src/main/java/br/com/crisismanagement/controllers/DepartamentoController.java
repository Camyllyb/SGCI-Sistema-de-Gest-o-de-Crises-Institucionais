package br.com.crisismanagement.controllers;

import java.util.List;

import br.com.crisismanagement.dto.DepartamentoRequest;
import br.com.crisismanagement.dto.DepartamentoResponse;
import br.com.crisismanagement.services.DepartamentoService;
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

@Path("/api/departamentos")
@Authenticated
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class DepartamentoController {

    @Inject
    DepartamentoService departamentoService;

    @GET
    public List<DepartamentoResponse> listAll() {
        return departamentoService.listAll();
    }

    @GET
    @Path("/{id}")
    public DepartamentoResponse findById(@PathParam("id") Long id) {
        return departamentoService.findById(id);
    }

    @POST
    @RolesAllowed("ADMIN")
    public Response create(@Valid DepartamentoRequest request) {
        DepartamentoResponse created = departamentoService.create(request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public DepartamentoResponse update(@PathParam("id") Long id, @Valid DepartamentoRequest request) {
        return departamentoService.update(id, request);
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response deactivate(@PathParam("id") Long id) {
        departamentoService.deactivate(id);
        return Response.noContent().build();
    }
}
