package com.project.www.domain;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class OrdersVO {

    private String merchantUid;
    private String customerId;
    private long productId;
    private long qty;
    private long payPrice;
    private String ordersDate;
    private String status;
    private ProductVO productVO;


}
