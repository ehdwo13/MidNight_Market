package com.project.www.service;

import com.project.www.domain.OrdersVO;

import java.util.List;

public interface OrdersService {
    List<OrdersVO> getMyPurchasedProductList(String customerId);
}
