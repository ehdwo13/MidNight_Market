package com.project.www.controller;

import com.project.www.domain.CouponDTO;
import com.project.www.domain.CouponVO;
import com.project.www.domain.MemberCouponVO;
import com.project.www.service.CouponService;
import com.project.www.service.MemberCouponService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/coupon/*")
@RequiredArgsConstructor
@Slf4j
public class CouponController {
    private final CouponService csv;
    private final MemberCouponService mcsv;

    @ResponseBody
    @GetMapping("/add/{customerId}/{couponId}")
    public String addCoupon(@PathVariable("customerId") String customerId, @PathVariable("couponId") String couponId) {
        int isOk = mcsv.addCoupon(customerId, couponId);
        return isOk > 0 ? "1" : "0";
    }


    @ResponseBody
    @GetMapping("/search/{couponCode}/{customerId}")
    public long searchCoupon(@PathVariable("couponCode")String couponCode, @PathVariable("customerId")String customerId) {
        long couponId = csv.search(couponCode);
        Boolean isExist = mcsv.isExist(couponId,customerId);
       if(isExist == false){
           if(couponId > 0){
               return couponId;
           }else{
               return -1;
           }
       }else{
           return -2;
       }
    }
    @ResponseBody
    @GetMapping("/{customerId}")
    public List<CouponDTO> getCoupon(@PathVariable("customerId")String customerId) {
        List<CouponDTO>couponDTO = new ArrayList<>();
        List<MemberCouponVO>memberCouponList = mcsv.getMemberCouponList(customerId);
        for(MemberCouponVO memberCouponVO : memberCouponList){
            long tmpCouponId = memberCouponVO.getCouponId();
            CouponVO cvo = csv.getCouponList(tmpCouponId);
            CouponDTO cdto = new CouponDTO();
            cdto.setCvo(cvo);
            cdto.setMemberCouponVO(memberCouponVO);
            couponDTO.add(cdto);
        }
        return couponDTO;
    }
}

