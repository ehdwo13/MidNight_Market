package com.project.www.domain;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ProductCategoryDetailVO {

    private long id;
    private String name;
    private long productCategoryId;

}
