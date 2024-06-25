package com.project.www.controller;

import com.project.www.domain.CouponVO;
import com.project.www.service.CouponService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/admin/*")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final CouponService csv;

    @GetMapping("/admin")
    public void admin(){
    }

    @ResponseBody
    @PostMapping("/makeCoupon")
    public String makeCoupon(@RequestBody CouponVO cvo){
        int isOk = csv.insert(cvo);
        if(isOk > 0){
            return "ok";
        }
        return "no";
    }

    @ResponseBody
    @GetMapping("/getList")
    public List<CouponVO> getList(){
        return csv.getList();
    }
}
