package com.project.www.controller;

import com.project.www.domain.NoticeVO;
import com.project.www.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Slf4j
@RequestMapping("/notice/*")
@RequiredArgsConstructor
@Controller
public class NoticeController {
    private final NoticeService nsv;

    @GetMapping("/register")
    public void register(){};

    @PostMapping("/register")
    public String register(NoticeVO nvo){
        log.info("{}",nvo);
        nsv.register(nvo);
        return "redirect:/notice/notice";
    }

    @GetMapping("/notice")
    public void notice(Model m){
        List<NoticeVO> list = nsv.getList();
        m.addAttribute("list",list);
    }

//    @GetMapping("/detail")


}
