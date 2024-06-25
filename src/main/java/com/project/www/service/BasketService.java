package com.project.www.service;

import com.project.www.domain.BasketVO;
import com.project.www.domain.ProductVO;

import java.util.List;

public interface BasketService {
    String register(BasketVO basketVO);

    BasketVO productDuplicationVerify(BasketVO basketVO);

    String productDuplicationUpdate(BasketVO basketVO);

    List<BasketVO> getMyBasket(String email);

    ProductVO getProductDetail(long productId);

    int delete(List<BasketVO> basketList);

    int update(BasketVO basketVO);

    int getBasketTotalCount(String username);

    int myBasketCheckedUpdate(BasketVO basketVO);
}