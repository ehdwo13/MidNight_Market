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
    public List<ProductVO> getIndexNewProductList() {
        return productMapper.getIndexNewProductList();
    }

    @Override
    public List<ProductVO> getIndexHeavySoldList() {
        return productMapper.getIndexHeavySoldList();
    }

    @Override
    public List<ProductVO> getIndexDiscountProductList() {
        return productMapper.getIndexDiscountProductList();
    }
}
