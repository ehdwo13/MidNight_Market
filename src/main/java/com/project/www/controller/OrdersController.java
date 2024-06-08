package com.project.www.controller;

import com.project.www.domain.OrdersVO;
import com.project.www.service.OrdersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/orders/*")
public class OrdersController {

    private final OrdersService osv;

    @ResponseBody
    @GetMapping("/getMyPurchasedProductList/{customerId}")
    public List<OrdersVO> getMyPurchasedProductList(@PathVariable("customerId") String customerId){

        return osv.getMyPurchasedProductList(customerId);
    }

}
