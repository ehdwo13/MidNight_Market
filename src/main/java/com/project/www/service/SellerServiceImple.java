package com.project.www.service;

import com.project.www.domain.ProductDTO;
import com.project.www.domain.ProductVO;
import com.project.www.domain.SellerVO;
import com.project.www.repository.ProductMapper;
import com.project.www.repository.SellerMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class SellerServiceImple implements SellerService{

    private final SellerMapper sellerMapper;
    private final ProductMapper productMapper;

    @Override
    public int register(SellerVO sellerVO) {
        return sellerMapper.register(sellerVO);
    }

    @Override
    public  List<ProductVO> getMyRegisteredProduct(String id) {
        return productMapper.getMyRegisteredProduct(id);
    }

    @Override
    public int productQtyUpdate(ProductVO productVO) {
        return productMapper.productQtyUpdate(productVO);
    }

    @Override
    public int checkId(String id) {
       int count = sellerMapper.checkId(id);
       return count;
    }

    @Override
    public int checkShopName(String shopName) {
        int count = sellerMapper.checkShopName(shopName);
        return count;
    }


}
