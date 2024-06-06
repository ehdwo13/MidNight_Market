package com.project.www.controller;

import com.project.www.service.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;


@RequestMapping("/mail/*")
@RestController
@Slf4j
@RequiredArgsConstructor
public class MailController {
    private final MailService mailService;

    @ResponseBody
    @GetMapping("/mailSend/{mail}")
    public void mailSend(@PathVariable("mail")String mail) {
        log.info("메일 확인{}",mail);
        mailService.sendMail(mail);
    }

    @ResponseBody
    @GetMapping("/mailCheck/{inputNumber}")
    public String mailCheck(@PathVariable("inputNumber")int inputNumber) {
        log.info("넘버확인{}",inputNumber);
        log.info("난수확인{}",mailService.getNumber());
        Boolean isCorrect = mailService.checkNumber(inputNumber);
        log.info("isCorrect:{}",isCorrect);
        return isCorrect ? "1" : "0";
    }
}
