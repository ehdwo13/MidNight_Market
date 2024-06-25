package com.project.www.domain;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDTO {

    private ProductVO productVO;
    private ProductCategoryVO pcVO;
    private ProductCategoryDetailVO pcdVO;
    private List<ProductDetailImageVO> imageList;
    private List<ProductCategoryVO> pcList;
    private List<ProductCategoryDetailVO> pcdList;
    private SlangVO slangVO;
    private String shopName;
}
