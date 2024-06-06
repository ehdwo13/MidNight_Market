package com.project.www.controller;

import com.project.www.domain.HelpVO;
import com.project.www.domain.NoticeVO;
import com.project.www.domain.PagingVO;
import com.project.www.handler.PagingHandler;
import com.project.www.service.HelpService;
import com.project.www.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/help/*")
@Controller
public class HelpController {
  private final HelpService hsv;
  private int isOK;

  @GetMapping("/desk")
  public void desk(){}

  @GetMapping("/register")
  public void register(){}

  @PostMapping("/register")
  public String register(HelpVO hvo){
    log.info("hvo{}",hvo);
    isOK = hsv.register(hvo);
    return "redirect:/help/list";
  }

//  @GetMapping("/list")
//  public void list(Model m){
//    List<HelpVO> list = hsv.getList();
//    m.addAttribute("list", list);
//  }

  @GetMapping("/list")
  public void list(Model m, PagingVO pgvo){
    List<HelpVO> list = hsv.getList(pgvo);

    int totalCount = hsv.getTotal(pgvo);

    PagingHandler ph = new PagingHandler(pgvo, totalCount);

    log.info("totalCount{}", totalCount);
    log.info("ph{}", ph);

    m.addAttribute("list", list);
    m.addAttribute("ph", ph);
  }

  @GetMapping("/detail")
  public void detail(Model m, @RequestParam("hno") long hno){
    HelpVO hvo = hsv.getDetail(hno);
    m.addAttribute("hvo", hvo);
  }

  @GetMapping("/modify")
  public void modify(Model m, @RequestParam("hno") long hno){
    HelpVO hvo = hsv.getDetail(hno);
    m.addAttribute("hvo", hvo);
  }

  @PostMapping("/modify")
  public String modify(HelpVO hvo){
    log.info("hvo{}",hvo);
    isOK = hsv.modify(hvo);
      return "redirect:/help/list?hno="+hvo.getHno();
  }

  @GetMapping("/delete")
  public String delete(Model m, @RequestParam("hno") long hno){
    isOK = hsv.delete(hno);
    log.info("hno{}",hno);
    m.addAttribute("test", isOK);
    return "redirect:/help/list";
  }

  @PostMapping("/reply")
  public String reply(HelpVO hvo){
    log.info("hvo{}",hvo);

    hsv.replyRegister(hvo);
    return "redirect:/help/detail?hno="+hvo.getHno();
  }

  @GetMapping("/replyAns")
  public void replyAns(Model m, @RequestParam("hno") long hno){
    HelpVO hvo = hsv.getDetail(hno);
    m.addAttribute("hvo", hvo);
  }



}
