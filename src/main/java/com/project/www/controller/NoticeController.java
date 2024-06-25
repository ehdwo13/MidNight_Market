package com.project.www.controller;

import com.project.www.domain.NoticeVO;
import com.project.www.domain.PagingVO;
import com.project.www.handler.PagingHandler;
import com.project.www.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
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
        nsv.register(nvo);
        return "redirect:/notice/notice";
    }

    @GetMapping("/notice")
    public void notice(Model m, PagingVO pgvo){
        List<NoticeVO> list = nsv.getList(pgvo);
        int totalCount = nsv.getTotal(pgvo);
        PagingHandler ph = new PagingHandler(pgvo, totalCount);
        SimpleDateFormat originalFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); // 기존 문자열 형식
        SimpleDateFormat targetFormat = new SimpleDateFormat("yyyy년 MM월 dd일");
        for(NoticeVO nvo : list){
            try {
                Date date = originalFormat.parse(nvo.getRegisterDate());
                nvo.setFormattedDate(targetFormat.format(date));
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        }
        m.addAttribute("list",list);
        m.addAttribute("ph", ph);
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
        isOk = nsv.modify(nvo);

        return "redirect:/notice/detail?id="+nvo.getId();
    }

    @GetMapping("/remove")
    public String remove(@RequestParam("id") long id) {
        nsv.remove(id);
        return "redirect:/notice/notice";
    }

}
