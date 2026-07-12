package br.com.crisismanagement.controllers;

import java.util.List;

import br.com.crisismanagement.dto.AcaoCriseRequest;
import br.com.crisismanagement.dto.AcaoCriseResponse;
import br.com.crisismanagement.dto.CriseRequest;
import br.com.crisismanagement.dto.CriseResponse;
import br.com.crisismanagement.dto.StatusUpdateRequest;
import br.com.crisismanagement.services.CriseService;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/crises")
@Authenticated
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CriseController {

    @Inject
    CriseService criseService;

    @GET
    public List<CriseResponse> listAll() {
        return criseService.listAll();
    }

    @GET
    @Path("/{id}")
    public CriseResponse findById(@PathParam("id") Long id) {
        return criseService.findById(id);
    }

    @POST
    @RolesAllowed({"ADMIN", "COMUM"})
    public Response create(@Valid CriseRequest request) {
        CriseResponse created = criseService.create(request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PATCH
    @Path("/{id}/status")
    @RolesAllowed("ADMIN")
    public CriseResponse changeStatus(@PathParam("id") Long id, @Valid StatusUpdateRequest request) {
        return criseService.changeStatus(id, request.status());
    }

    @GET
    @Path("/{id}/acoes")
    public List<AcaoCriseResponse> listAcoes(@PathParam("id") Long id) {
        return criseService.listAcoes(id);
    }

    @POST
    @Path("/{id}/acoes")
    @RolesAllowed("ADMIN")
    public Response addAcao(@PathParam("id") Long id, @Valid AcaoCriseRequest request) {
        AcaoCriseResponse created = criseService.addAcao(id, request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }
}
