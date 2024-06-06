package com.project.www.domain;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ProductVO {

    private long id;
    private String name;
    private long price;
    private int discountRate;
    private long discountPrice;
    private long productCategoryDetailId;
    private String description;
    private long totalQty;
    private long totalSoldQty;
    private String registerDate;
    private String mainImage;
    private String thumbImage;
    private String sellerId;


}
