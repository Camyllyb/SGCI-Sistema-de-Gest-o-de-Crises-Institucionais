package br.com.crisismanagement.controllers;

import br.com.crisismanagement.dto.ChangePasswordRequest;
import br.com.crisismanagement.dto.ForgotPasswordRequest;
import br.com.crisismanagement.dto.LoginRequest;
import br.com.crisismanagement.dto.LoginResponse;
import br.com.crisismanagement.dto.ProfileResponse;
import br.com.crisismanagement.dto.ResetPasswordRequest;
import br.com.crisismanagement.dto.UserResponse;
import br.com.crisismanagement.security.AuthCookieFactory;
import br.com.crisismanagement.services.AuthService;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
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
        AuthService.LoginResult result = authService.login(request.email(), request.password());
        return Response.ok(new LoginResponse(true, "Login realizado com sucesso", result.mustChangePassword()))
                .cookie(authCookieFactory.buildLoginCookie(result.token(), AuthService.TOKEN_EXPIRATION_SECONDS))
                .build();
    }

    @POST
    @Path("/change-password")
    @Authenticated
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response changePassword(@Valid ChangePasswordRequest request) {
        String token = authService.changePassword(request.currentPassword(), request.newPassword());
        return Response.ok(new LoginResponse(true, "Senha alterada com sucesso", false))
                .cookie(authCookieFactory.buildLoginCookie(token, AuthService.TOKEN_EXPIRATION_SECONDS))
                .build();
    }

    @POST
    @Path("/logout")
    @Authenticated
    @Produces(MediaType.APPLICATION_JSON)
    public Response logout() {
        return Response.ok(new LoginResponse(false, "Logout realizado com sucesso", false))
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

    @GET
    @Path("/perfil")
    @Authenticated
    @Produces(MediaType.APPLICATION_JSON)
    public ProfileResponse perfil() {
        return authService.getProfile();
    }

    /**
     * Inicia a recuperação de senha. A resposta é sempre 204, independentemente
     * de o e-mail existir, para não permitir enumeração de contas.
     */
    @POST
    @Path("/forgot-password")
    @PermitAll
    @Consumes(MediaType.APPLICATION_JSON)
    public Response forgotPassword(@Valid ForgotPasswordRequest request) {
        authService.requestPasswordReset(request.email());
        return Response.noContent().build();
    }

    @POST
    @Path("/reset-password")
    @PermitAll
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response resetPassword(@Valid ResetPasswordRequest request) {
        authService.resetPassword(request.token(), request.newPassword());
        return Response.ok(new LoginResponse(false, "Senha redefinida com sucesso", false)).build();
    }
}
