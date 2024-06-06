package com.project.www.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;

@Getter
@Service
@RequiredArgsConstructor
@EnableAsync
public class MailService {

    private final JavaMailSender javaMailSender;
    private static final String senderEmail= "midnightamn@gmail.com";
    private final int number = createNumber();

    @Async("mailExecutor")
    public void sendMail(String mail) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            message.setFrom(senderEmail);
            message.setRecipients(MimeMessage.RecipientType.TO, mail);
            message.setSubject("이메일 인증");
            String body = "";
            body += "<h3>" + "요청하신 인증 번호입니다." + "</h3>";
            body += "<h1>" + number + "</h1>";
            body += "<h3>" + "감사합니다." + "</h3>";
            message.setText(body,"UTF-8", "html");
            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
    private int createNumber() {
        return (int)(Math.random() * (90000)) + 100000; //(int) Math.random() * (최댓값-최소값+1) + 최소값
    }

    public Boolean checkNumber(int inputNumber) {
        return number == inputNumber;
    }

    @Async
    public void sendResetPw(String id) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            message.setFrom(senderEmail);
            message.setRecipients(MimeMessage.RecipientType.TO, id);
            message.setSubject("비밀번호 초기화");
            String body = "";
            body += "<h3>" + "해당 비밀번호로 로그인 후 비밀번호를 변경해주세요." + "</h3>";
            body += "<h1>" + "resetPw" + "</h1>";
            body += "<h3>" + "감사합니다." + "</h3>";
            message.setText(body,"UTF-8", "html");
            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}