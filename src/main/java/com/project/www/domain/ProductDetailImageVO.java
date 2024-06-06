package com.project.www.domain;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetailImageVO {

    private String detailImage;
    private int sequence;
    private long productId;

}
