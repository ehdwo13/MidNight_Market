package com.project.www.service;

import com.project.www.domain.ProductVO;

import java.util.List;

public interface IndexService {
    List<ProductVO> getNewProductList();

    List<ProductVO> getHeavySoldList();

    List<ProductVO> getDiscountProductList();
}
