package com.project.www.controller;

import com.project.www.config.oauth2.PrincipalDetails;
import com.project.www.domain.CustomerVO;
import com.project.www.service.CustomerService;
import com.project.www.service.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RequiredArgsConstructor
@RequestMapping("/customer/*")
@Controller
public class CustomerController {
    private final CustomerService csv;
    private final MailService msv;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @GetMapping("/insert")
    public void insert() {
    }

    @PostMapping("/insert")
    public String insert(CustomerVO cvo) {
        cvo.setPw(bCryptPasswordEncoder.encode(cvo.getPw()));
        cvo.setProvider("form");
        cvo.setProviderId(cvo.getId());
        cvo.setRole("ROLE_USER");
        csv.insert(cvo);
        return "index";
    }

    @GetMapping("/registerSelect")
    public void registerSelect() {
    }

    @GetMapping("/socialSelect")
    public void socialSelect() {
    }

    @ResponseBody
    @GetMapping("/check/{email}")
    public String checkEmail(@PathVariable("email") String email) {
        int isOk = csv.checkEmail(email);
        return isOk > 0 ? "1" : "0";
    }

    @ResponseBody
    @GetMapping("/checkN/{nickName}")
    public String checkNickName(@PathVariable("nickName") String nickName) {

        int isOk = csv.checkNickName(nickName);
        return isOk > 0 ? "1" : "0";
    }

    @GetMapping("/changePw")
    public void changePw() {
        log.info("test");
    }

    @GetMapping("/findId")
    public void findId() {
    }

    @ResponseBody
    @GetMapping("/findId/{nickName}")
    public String findId(@PathVariable("nickName") String nickName) {
        return csv.findNickName(nickName);
    }

    @ResponseBody
    @GetMapping("/findAccount/{id}")
    public int findAccount(@PathVariable("id") String id) {
        int isOk = csv.findId(id);
        if (isOk > 0) {
            String pw = bCryptPasswordEncoder.encode("resetPw");
            csv.updateDefaultPw(id, pw);
            msv.sendResetPw(id);
        }
        return csv.findId(id);
    }
    @ResponseBody
    @GetMapping("/resetPw/{id}/{pw}")
    public String resetPw(@PathVariable("id") String id, @PathVariable("pw") String pw) {
        log.info("test");
        log.info("아이디 {}", id);
        log.info("비번 {}", pw);
        String bCryptPw = bCryptPasswordEncoder.encode(pw);
        csv.updateDefaultPw(id, bCryptPw);
        return "1";
    }

    @GetMapping("/info")
    public @ResponseBody String user(@AuthenticationPrincipal PrincipalDetails principalDetails){
        log.info("{}",principalDetails.getUsername());
        log.info("{}",principalDetails.getAttributes());

        return principalDetails.getUsername();
    }

    @GetMapping("/myPage")
    public void myPage() {}
}