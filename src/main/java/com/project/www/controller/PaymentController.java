package com.project.www.controller;

import com.mysql.cj.Session;
import com.project.www.config.oauth2.PrincipalDetails;
import com.project.www.domain.*;
import com.project.www.service.*;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/payment/*")
public class PaymentController {

    private final PaymentService psv;
    private final ImportService importService;
    private final NotificationService nsv;
    private final MemberCouponService mscv;
    private final CouponService csv;

    @ResponseBody
    @PostMapping("/post")
    public String paymentPost(@RequestBody PaymentDTO paymentDTO) {
        return psv.post(paymentDTO);
    }

    @ResponseBody
    @PostMapping("/basketPost")
    public String basketPaymentPost(@RequestBody PaymentDTO paymentDTO) {
        return psv.basketPost(paymentDTO);
    }

    @ResponseBody
    @PostMapping("/saveMembershipPaymentInfo")
    public String saveMembershipPaymentInfo(@RequestBody PaymentDTO paymentDTO) {
        return psv.saveMembershipPaymentInfo(paymentDTO);
    }

    @GetMapping("/memberShipPaymentPopup")
    public void memberShipPaymentPopup() {
    }


    @PostMapping("/orders")
    public String order(@RequestParam("merchantUid") String merchantUid, Model model) {

        //나의 결제 상품 가져오기
        PaymentDTO paymentDTO = psv.getMyPaymentProduct(merchantUid);

        //내쿠폰 정보
        int couponCount = mscv.getCount(paymentDTO.getCustomerId());
        List<MemberCouponVO>mList = mscv.getMemberCouponList(paymentDTO.getCustomerId());
        List<CouponVO> couponList = new ArrayList<>();
        for(MemberCouponVO mcvo : mList) { //쿠폰목록 불러오기
            long couponId = mcvo.getCouponId();
            CouponVO cvo = csv.getCouponList(couponId);
            couponList.add(cvo);
        }
        model.addAttribute("couponList", couponList);
        model.addAttribute("couponCount", couponCount);
        model.addAttribute("paymentDTO", paymentDTO);
        return "payment/orders";
    }

    //사전검증
    @ResponseBody
    @PostMapping("/prepare")
    public void prepare(@RequestBody PaymentDTO paymentDTO) throws IamportResponseException, IOException {
        psv.usedPointAndCouponUpdate(paymentDTO);
        importService.postPrepare(paymentDTO);
    }

    //사후검증
    @ResponseBody
    @PostMapping("/validate")
    public Payment validatePayment(@RequestBody PaymentDTO paymentDTO) throws IamportResponseException, IOException {
        return importService.validatePaymnet(paymentDTO);
    }

    @ResponseBody
    @PostMapping("/successUpdate")
    public String successUpdatePayment(@RequestBody PaymentDTO paymentDTO) {

        int isOk = psv.paySuccessUpdate(paymentDTO);
        return isOk > 0 ? "paySuccessUpdate" : "payUpdateFail";
    }

    @ResponseBody
    @PutMapping("/membershipRegistrationCompletedUpdate")
    public String membershipRegistrationCompletedUpdate(@RequestBody PaymentDTO paymentDTO) {
        int isOk = psv.membershipRegistrationCompletedUpdate(paymentDTO);
        if (isOk > 0) {
            NotificationVO nvo = new NotificationVO();
            mscv.addCoupon(paymentDTO.getCustomerId(), "2");
            mscv.addCoupon(paymentDTO.getCustomerId(), "3");
            mscv.addCoupon(paymentDTO.getCustomerId(), "4");
            nvo.setCustomerId(paymentDTO.getCustomerId());
            nvo.setNotifyContent("멤버쉽가입 쿠폰3장이 발급완료되었습니다. ");
            nsv.insert(nvo);
        }
        return isOk > 0 ? "success" : "fail";
    }


    //결제 성공시 성공페이지 이동
    @GetMapping("/success/{merchantUid}")
    public String success(Model model, @PathVariable("merchantUid") String merchantUid) {


        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        
        double memberShipPointeRate = 0;
        boolean isMemberShip =  principalDetails.getMStatus(); //멤버쉽 유무

        if(isMemberShip){ //멤버쉽일 경우
            memberShipPointeRate = 0.05;
        }else{
            memberShipPointeRate = 0.01;
        }
        PaymentDTO paymentDTO = psv.getMyPaymentProduct(merchantUid);

        long pointsToAward = Math.round(paymentDTO.getOriginalPrice() * memberShipPointeRate);

        paymentDTO.setOriginalPrice(pointsToAward);
        model.addAttribute("paymentDTO", paymentDTO);

        //알림추가
        NotificationVO nvo = new NotificationVO();
        nvo.setCustomerId(principalDetails.getUsername());
        //이부분에 포인트만 계산한값 넣어주세요
        nvo.setNotifyContent("구매가 완료되었습니다. 구매확정시 포인트 "+ pointsToAward +" 원 지급될 예정입니다. ");
        nsv.insert(nvo);
        return "payment/success";
    }

    //환불
    @Transactional
    @ResponseBody
    @PostMapping("/refund")
    public String refund(@RequestBody OrdersVO ordersVO) {
        return psv.refundUpdate(ordersVO);
    }

    @GetMapping("/addrModifyPopup")
    public String addrModifyPopup() {
        return "payment/addrModifyPopup";
    }

    @GetMapping("/newAddrAddPopup")
    public String newAddrAddPopup() {
        return "payment/newAddrAddPopup";
    }


}