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
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Slf4j
@RequestMapping("/notice/*")
@RequiredArgsConstructor
@Controller
public class NoticeController {
    private final NoticeService nsv;
    private int isOk;

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

    @GetMapping("/detail")
    public void detail(Model m, @RequestParam("id") long id){
        NoticeVO nvo = nsv.getDetail(id);
        m.addAttribute("nvo", nvo);
    }

    @GetMapping("/modify")
    public void modify(Model m, @RequestParam("id") long id){
        NoticeVO nvo = nsv.getDetail(id);
        m.addAttribute("nvo", nvo);
    }

    @PostMapping("/modify")
    public String modify(NoticeVO nvo){
        log.info("nvo{}",nvo);
        isOk = nsv.modify(nvo);

        return "redirect:/notice/detail?id="+nvo.getId();
    }

    @GetMapping("/remove")
    public String remove(@RequestParam("id") long id) {
        nsv.remove(id);
        return "redirect:/notice/notice";
    }

}
