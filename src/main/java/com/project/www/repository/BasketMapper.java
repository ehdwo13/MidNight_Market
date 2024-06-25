package com.project.www.repository;

import com.project.www.domain.BasketVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BasketMapper {
    int register(BasketVO basketVO);

    BasketVO productDuplicationVerify(BasketVO basketVO);

    int productDuplicationUpdate(BasketVO basketVO);

    List<BasketVO> getMyBasket(String email);

    int delete(BasketVO bvo);

    int update(BasketVO basketVO);

    int getBasketTotalCount(String username);

    int myBasketCheckedUpdate(BasketVO basketVO);

    int clearBasketOnPaymentSuccess(String customerId);

    List<BasketVO> getReadyToCheckoutCartItems(String customerId);
}