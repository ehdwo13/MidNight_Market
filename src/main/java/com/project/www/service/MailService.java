package com.project.www.service;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Base64;

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
            message.setFrom(new InternetAddress(senderEmail, "미드나잇 마켓"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(mail));
            message.setSubject("이메일 인증");

            String body = "<html><body>";
            body += "<h2 style='color: #0040ff;'>이메일 인증 요청</h2>";
            body += "<p>아래의 인증 번호를 사용하여 계속 진행하세요:</p>";
            body += "<h1 style='font-size: 48px;'>" + number + "</h1>";
            body += "<p>감사합니다.</p>";
            body += "</body></html>";

            message.setContent(body, "text/html; charset=utf-8");

            javaMailSender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    private int createNumber() {
        return (int)(Math.random() * (90000)) + 100000;
    }

    public Boolean checkNumber(int inputNumber) {
        return number == inputNumber;
    }

    @Async
    public void sendResetPw(String id) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            message.setFrom(new InternetAddress(senderEmail, "미드나잇 마켓"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(id));
            message.setSubject("비밀번호 초기화 안내");

            String body = "<html><body>";
            body += "<h2 style='color: #0040ff;'>비밀번호 초기화 안내</h2>";
            body += "<p>아래의 임시 비밀번호로 로그인 후 새로운 비밀번호를 설정해 주세요:</p>";
            body += "<h1 style='font-size: 36px;'>" + "resetPw" + "</h1>";
            body += "<p>감사합니다.</p>";
            body += "</body></html>";

            message.setContent(body, "text/html; charset=utf-8");

            javaMailSender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }
}