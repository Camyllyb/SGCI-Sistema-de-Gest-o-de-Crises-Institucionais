package br.com.crisismanagement.controllers;

import br.com.crisismanagement.dto.DashboardResponse;
import br.com.crisismanagement.services.DashboardService;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/dashboard")
@Authenticated
@Produces(MediaType.APPLICATION_JSON)
public class DashboardController {

    @Inject
    DashboardService dashboardService;

    @GET
    @Path("/resumo")
    public DashboardResponse resumo() {
        return dashboardService.resumo();
    }
}
