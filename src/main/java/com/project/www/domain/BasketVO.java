package com.project.www.domain;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BasketVO {

    private String customerId;
    private long productId;
    private long qty;
    private boolean isChecked;
    private String type;
    private ProductVO productVO;
}
