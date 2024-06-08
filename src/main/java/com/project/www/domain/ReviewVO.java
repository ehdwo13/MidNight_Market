package com.project.www.domain;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ReviewVO {

    private long id;
    private String content;
    private long star;
    private String registerDate;
    private String customerId;
    private String productId;
    private long ordersId;
}
