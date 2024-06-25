package com.project.www.domain;

import lombok.*;

@Builder
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ProductVO {

    private long id;
    private String name;
    private long price;
    private int discountRate; //할인율
    private long discountPrice; //할인된가격(할인율 0%일때는 price와 같음)
    private long productCategoryDetailId;
    private String description;
    private long totalQty;
    private long totalSoldQty;
    private String registerDate;
    private String mainImage;
    private String thumbImage;
    private String sellerId;
    private long reviewCount;
}
