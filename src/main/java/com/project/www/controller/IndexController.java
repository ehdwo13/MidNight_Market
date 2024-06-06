package com.project.www.controller;

import com.project.www.config.oauth2.PrincipalDetails;
import com.project.www.domain.ProductVO;
import com.project.www.service.IndexService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@RequiredArgsConstructor
@Controller
@Slf4j
public class IndexController {

    private final IndexService isv;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @GetMapping("/")
    public String index(Model model, HttpServletRequest request, @AuthenticationPrincipal PrincipalDetails principal) {

        List<ProductVO> newProductList = isv.getNewProductList();
        List<ProductVO> heavySoldList = isv.getHeavySoldList();
        List<ProductVO> discountProductList = isv.getDiscountProductList();
        if (principal != null) {
//            model.addAttribute("name", principal.getNickName());
//            model.addAttribute("id",principal.getUsername());
            HttpSession ses = request.getSession();
            ses.setAttribute("name", principal.getNickName());
            ses.setAttribute("id", principal.getUsername());
            if(principal.getPassword() != null){
                if(bCryptPasswordEncoder.matches("resetPw",principal.getPassword())){
                    model.addAttribute("pwReset", 1);
                }
            }
        }
        model.addAttribute("newProductList", newProductList);
        model.addAttribute("heavySoldList", heavySoldList);
        model.addAttribute("discountProductList", discountProductList);
        return "index";
    }


}
