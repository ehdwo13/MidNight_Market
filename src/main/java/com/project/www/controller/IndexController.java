package com.project.www.controller;

import com.project.www.config.oauth2.PrincipalDetails;
import com.project.www.config.oauth2.SellerPrincipalDetails;
import com.project.www.domain.ProductVO;
import com.project.www.service.BasketService;
import com.project.www.service.IndexService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
@Controller
@Slf4j
public class IndexController {

    private final IndexService isv;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @GetMapping("/")
    public String index(Model model,HttpServletResponse response, HttpServletRequest request, @AuthenticationPrincipal PrincipalDetails principal, @AuthenticationPrincipal SellerPrincipalDetails sellerPrincipalDetails) {

        List<ProductVO> newProductList = isv.getIndexNewProductList();
        List<ProductVO> heavySoldList = isv.getIndexHeavySoldList();
        List<ProductVO> discountProductList = isv.getIndexDiscountProductList();
        Cookie del = new Cookie("url", null);
        del.setMaxAge(0);
        response.addCookie(del);

        if(sellerPrincipalDetails != null){
            HttpSession ses = request.getSession();
            ses.setAttribute("name", sellerPrincipalDetails.getShopName());
            ses.setAttribute("id", sellerPrincipalDetails.getUsername());
            Collection<? extends GrantedAuthority> authorities = sellerPrincipalDetails.getAuthorities();
            for (GrantedAuthority authority : authorities) {
                ses.setAttribute("role", authority.getAuthority());
            }
            ses.setAttribute("shopName", sellerPrincipalDetails.getShopName());
        }
        if (principal != null) {
            HttpSession ses = request.getSession();
            ses.setAttribute("name", principal.getNickName());
            ses.setAttribute("id", principal.getUsername());
            Collection<? extends GrantedAuthority> authorities = principal.getAuthorities();
            for (GrantedAuthority authority : authorities) {
                ses.setAttribute("role", authority.getAuthority());
            }
            ses.setAttribute("mStatus", principal.getMStatus());
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
