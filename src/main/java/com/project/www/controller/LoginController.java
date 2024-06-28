package com.project.www.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/login/*")
@Controller
public class LoginController {

    private String path = "login/";

    @GetMapping("/form")
    public String customerLoginForm() {return path+"login";}

    @GetMapping("/seller/form")
    public String sellerLoginForm() {
        return "/login/login";
    }

    @GetMapping("/reset")
    public void reset(){}
}
