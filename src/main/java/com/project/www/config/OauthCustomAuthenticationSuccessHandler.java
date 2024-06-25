package com.project.www.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.swing.*;
import java.io.IOException;

@Slf4j
@Component
public class OauthCustomAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        Cookie[] cookies = request.getCookies();
        String returnUrlFromCookie = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("url")) {
                    returnUrlFromCookie = cookie.getValue().split("@")[0];
                    break;
                }
            }
        }
        if (returnUrlFromCookie != null && !returnUrlFromCookie.isEmpty()) {
            getRedirectStrategy().sendRedirect(request, response, returnUrlFromCookie);
            return;
        }

        super.onAuthenticationSuccess(request, response, authentication);
    }
}
