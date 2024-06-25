package com.project.www.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class CustomAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        String header = request.getHeader("Referer");
        if (header != null && header.contains("returnUrl=")) {
            String returnUrl = header.substring(header.indexOf("returnUrl=") + "returnUrl=".length());
            if (!returnUrl.isEmpty()) {
                getRedirectStrategy().sendRedirect(request, response, returnUrl);
                return;
            }
        }
        super.onAuthenticationSuccess(request, response, authentication);
    }
}

