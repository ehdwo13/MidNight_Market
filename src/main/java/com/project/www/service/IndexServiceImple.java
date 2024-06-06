package com.project.www.service;

import com.project.www.domain.ProductVO;
import com.project.www.repository.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IndexServiceImple implements IndexService{

    private final ProductMapper productMapper;

    @Override
    public List<ProductVO> getNewProductList() {
        return productMapper.getNewProductList();
    }

    @Override
    public List<ProductVO> getHeavySoldList() {
        return productMapper.getHeavySoldList();
    }

    @Override
    public List<ProductVO> getDiscountProductList() {
        return productMapper.getDiscountProductList();
    }
}
