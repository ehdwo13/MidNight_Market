package com.project.www.service;

import com.project.www.domain.ProductVO;

import java.util.List;

public interface IndexService {
    List<ProductVO> getIndexNewProductList();

    List<ProductVO> getIndexHeavySoldList();

    List<ProductVO> getIndexDiscountProductList();
}
