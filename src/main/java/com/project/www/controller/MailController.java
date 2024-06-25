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
//        long startTime = System.nanoTime();
        mailService.sendMail(mail);
//        long endTime = System.nanoTime();
//        long timeElapsed = endTime - startTime;
//        System.out.println("nano seconds :" +  timeElapsed);
//        System.out.println("milli seconds: " + timeElapsed / 1000000);
//        System.out.println("seconds : " + (double)timeElapsed / 1_000_000_000);
    }

    @ResponseBody
    @GetMapping("/mailCheck/{inputNumber}")
    public String mailCheck(@PathVariable("inputNumber")int inputNumber) {
        Boolean isCorrect = mailService.checkNumber(inputNumber);
        return isCorrect ? "1" : "0";
    }
}
