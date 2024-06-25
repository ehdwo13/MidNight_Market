package com.project.www.controller;

import com.project.www.domain.BasketVO;
import com.project.www.domain.ProductVO;
import com.project.www.service.BasketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/basket/*")
@RequiredArgsConstructor
@Slf4j
public class BasketController {

    private final BasketService bsv;

    @ResponseBody
    @PostMapping("/register")
    public String register(@RequestBody BasketVO basketVO){

        //상품의 중복 검사
        BasketVO productDuplicationVerifyVO = bsv.productDuplicationVerify(basketVO);

        //상품 잔여수량 검사
        ProductVO productVO = bsv.getProductDetail(basketVO.getProductId());

        if(productVO.getTotalQty() == 0){
            return "품절";
        }

        int isOk = 0;

        //장바구니에 똑같은 상품이 없을 시에
        if(productDuplicationVerifyVO == null){
            return bsv.register(basketVO);
        } else{

            // 장바구니에 넣을 수량 + 장바구니에 저장되어있는 수량 > 잔여수량 -> 저장되게 하면 안됌
            if((basketVO.getQty() + productDuplicationVerifyVO.getQty()) > productVO.getTotalQty()){
                return "excess_quantity"+productVO.getTotalQty();
            }

            return bsv.productDuplicationUpdate(basketVO);
        }

    }

    @GetMapping("/myBasket")
    public String myBasket(){
        return "/product/myBasket";
    }

    @ResponseBody
    @GetMapping("/myBasketList")
    public List<BasketVO> myBasketList(@RequestParam("customerId") String customerId){
        return bsv.getMyBasket(customerId);
    }

    @ResponseBody
    @PutMapping("/checkedUpdate")
    public String checkedUpdate(@RequestBody BasketVO basketVO){
        int isOk = bsv.myBasketCheckedUpdate(basketVO);
        return "잘들어옴";
    }


    @ResponseBody
    @DeleteMapping("/delete")
    public String delete(@RequestBody List<BasketVO> basketList){
        int isOk = bsv.delete(basketList);
        return isOk > 0 ? "success" : "fail";

    }

    @ResponseBody
    @PutMapping("/update")
    public String update(@RequestBody BasketVO basketVO){
        int isOk = bsv.update(basketVO);
        return isOk > 0 ? "success" : "fail";
    }

    @GetMapping("/getBasketQuantity/{customerId}")
    @ResponseBody
    public String GetBasketQuantity(@PathVariable("customerId")String customerId){
        return String.valueOf(bsv.getBasketTotalCount(customerId));
    }



}