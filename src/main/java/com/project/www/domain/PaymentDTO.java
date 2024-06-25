package com.project.www.domain;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class PaymentDTO {

    private String impUid;
    private String merchantUid;
    private String customerId;
    private String payDescription;
    private String payDate;
    private long originalPrice;
    private long payPrice;
    private String payMethod;
    private String address;
    private String status;
    //개수 상품아이디는 어떻게 할지? 그냥추가?
    private long productId;
    private long qty;
    private OrdersVO ordersVO;
    private List<OrdersVO> ordersList;
    private AddressVO addressVO; //배송지
    private long usedCouponId;
    private long usedPoint;
    private long usedCouponAmount;
}
