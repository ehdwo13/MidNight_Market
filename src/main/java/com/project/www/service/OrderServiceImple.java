package com.project.www.service;

import com.project.www.domain.OrdersVO;
import com.project.www.repository.OrdersMapper;
import com.project.www.repository.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImple implements OrdersService {

    private final OrdersMapper ordersMapper;
    private final ProductMapper productMapper;

    @Transactional
    @Override
    public List<OrdersVO> getMyPurchasedProductList(String customerId) {

        List<OrdersVO> ordersVOList = ordersMapper.getMyPurchasedProductList(customerId);

        for(OrdersVO ordersVO : ordersVOList){
            ordersVO.setProductVO(productMapper.getDetail(ordersVO.getProductId()));
        }
        return ordersVOList;
    }
}
