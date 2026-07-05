package br.com.crisismanagement.controllers;

import br.com.crisismanagement.dto.LoginRequest;
import br.com.crisismanagement.dto.LoginResponse;
import br.com.crisismanagement.dto.UserResponse;
import br.com.crisismanagement.security.AuthCookieFactory;
import br.com.crisismanagement.services.AuthService;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/auth")
public class AuthController {

    @Inject
    AuthService authService;

    @Inject
    AuthCookieFactory authCookieFactory;

    @POST
    @Path("/login")
    @PermitAll
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(LoginRequest request) {
        String token = authService.login(request.email(), request.password());
        return Response.ok(new LoginResponse(true, "Login realizado com sucesso"))
                .cookie(authCookieFactory.buildLoginCookie(token, AuthService.TOKEN_EXPIRATION_SECONDS))
                .build();
    }

    @POST
    @Path("/logout")
    @Authenticated
    @Produces(MediaType.APPLICATION_JSON)
    public Response logout() {
        return Response.ok(new LoginResponse(false, "Logout realizado com sucesso"))
                .cookie(authCookieFactory.buildLogoutCookie())
                .build();
    }

    @GET
    @Path("/me")
    @Authenticated
    @Produces(MediaType.APPLICATION_JSON)
    public UserResponse me() {
        return authService.getCurrentUser();
    }
}
