package com.project.www.domain;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class BasketVO {

    private String customerId;
    private long productId;
    private long qty;
    private ProductVO productVO;
}
