package com.project.www.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import java.io.IOException;

public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        if (exception.getMessage().equalsIgnoreCase("User is disabled")) {
            response.sendRedirect("/login/form?error=disabled");
        } else if (exception.getMessage().equalsIgnoreCase("User account has expired")) {
            response.sendRedirect("/login/form?error=expired");
        } else if (exception.getMessage().equalsIgnoreCase("Bad credentials")) {
            response.sendRedirect("/login/form?error=badCredentials");
        } else {
            response.sendRedirect("/login/form?error");
        }
    }
}
