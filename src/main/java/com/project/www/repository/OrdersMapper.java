package com.project.www.repository;

import com.project.www.domain.OrdersVO;
import com.project.www.domain.PaymentDTO;
import com.project.www.domain.ReviewVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrdersMapper {
    int register(OrdersVO ordersVO);

    List<OrdersVO> getMyOrdersProduct(String merchantUid);

    int paySuccessUpdate(PaymentDTO paymentDTO);

    List<OrdersVO> getMyPurchasedProductList(String customerId);

    int isReviewCommentUpdate(ReviewVO reviewVO);

    OrdersVO selectOne(long id);

    int refundUpdate(OrdersVO ordersVO);

    List<OrdersVO> getMyFrequentPurchasesList(String customerId);

    List<OrdersVO> getMyWriteReviewList(String customerId);

    int markAsDelivered();

    List<String> getDeliveredCustomers(int deliveredCount);

    List<OrdersVO> getList();

    int confirmOrderUpdate(OrdersVO ordersVO);

    List<OrdersVO> findExpiredOrders(String merchantUid);

    List<OrdersVO> getMyList(String currentId);

    void usedCombineDiscountUpdate(OrdersVO ordersVO);
}
