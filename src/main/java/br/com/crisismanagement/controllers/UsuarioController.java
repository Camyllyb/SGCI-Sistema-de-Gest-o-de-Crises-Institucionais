package br.com.crisismanagement.controllers;

import java.util.List;

import br.com.crisismanagement.dto.UsuarioRequest;
import br.com.crisismanagement.dto.UsuarioResponse;
import br.com.crisismanagement.services.UsuarioService;
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

/** CRUD de usuários — restrito ao perfil ADMIN. */
@Path("/api/usuarios")
@RolesAllowed("ADMIN")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UsuarioController {

    @Inject
    UsuarioService usuarioService;

    @GET
    public List<UsuarioResponse> listAll() {
        return usuarioService.listAll();
    }

    @GET
    @Path("/{id}")
    public UsuarioResponse findById(@PathParam("id") Long id) {
        return usuarioService.findById(id);
    }

    @POST
    public Response create(@Valid UsuarioRequest request) {
        UsuarioResponse created = usuarioService.create(request);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public UsuarioResponse update(@PathParam("id") Long id, @Valid UsuarioRequest request) {
        return usuarioService.update(id, request);
    }

    @DELETE
    @Path("/{id}")
    public Response deactivate(@PathParam("id") Long id) {
        usuarioService.deactivate(id);
        return Response.noContent().build();
    }

    @POST
    @Path("/{id}/reset-senha")
    @Consumes(MediaType.WILDCARD)
    public Response resetSenha(@PathParam("id") Long id) {
        usuarioService.resetPassword(id);
        return Response.noContent().build();
    }
}
