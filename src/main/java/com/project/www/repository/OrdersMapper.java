package com.project.www.repository;

import com.project.www.domain.OrdersVO;
import com.project.www.domain.ReviewVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrdersMapper {
    void register(OrdersVO ordersVO);

    List<OrdersVO> getMyOrdersProduct(String merchantUid);

    void paySuccessUpdate(String merchantUid);

    List<OrdersVO> getMyPurchasedProductList(String customerId);

    int isReviewCommentUpdate(ReviewVO reviewVO);
}
