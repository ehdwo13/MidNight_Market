package com.project.www.service;

import com.project.www.domain.OrdersVO;

import java.util.List;

public interface OrdersService {
    List<OrdersVO> getMyPurchasedProductList(String customerId);

    List<OrdersVO> getMyFrequentPurchasesList(String customerId);

    List<OrdersVO> getMyWriteReviewList(String customerId);

    List<OrdersVO> getList();

    String confirmOrderUpdate(OrdersVO ordersVO);

    List<OrdersVO> getMyList(String currentId);
}
