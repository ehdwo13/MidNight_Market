package com.project.www.service;

import com.project.www.domain.ProductDTO;
import com.project.www.domain.ProductVO;
import com.project.www.domain.SellerVO;

import java.util.List;

public interface SellerService {

    int register(SellerVO sellerVO);

    List<ProductVO> getMyRegisteredProduct(String id);

    String myRegisteredProductUpdate(ProductVO productVO);

    int checkId(String id);

    int checkShopName(String shopName);

    List<SellerVO> getList();

    String getShopName(String sellerId);

    String getSellerId(String marketName);
}
