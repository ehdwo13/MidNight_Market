package com.project.www.service;

import com.project.www.repository.OrdersMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderServiceImple implements OrdersService {

    private final OrdersMapper ordersMapperr;

}
