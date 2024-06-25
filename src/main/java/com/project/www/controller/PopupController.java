package com.project.www.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Slf4j
@Controller
@RequiredArgsConstructor
public class PopupController {

    @GetMapping("/popup")
    public String popup() {
        return "popup/popup";
    }

}
