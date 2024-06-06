package com.project.www.controller;

import com.project.www.service.OrdersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/productBuy/*")
public class OrdersController {

    private final OrdersService osv;

}
