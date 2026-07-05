package br.com.crisismanagement.security;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.NewCookie;

@ApplicationScoped
public class AuthCookieFactory {

    public static final String COOKIE_NAME = "jwt";

    public NewCookie buildLoginCookie(String token, long maxAgeSeconds) {
        return new NewCookie.Builder(COOKIE_NAME)
                .value(token)
                .path("/")
                .httpOnly(true)
                .sameSite(NewCookie.SameSite.LAX)
                .maxAge((int) maxAgeSeconds)
                .build();
    }

    public NewCookie buildLogoutCookie() {
        return new NewCookie.Builder(COOKIE_NAME)
                .value("")
                .path("/")
                .httpOnly(true)
                .sameSite(NewCookie.SameSite.LAX)
                .maxAge(0)
                .build();
    }
}
