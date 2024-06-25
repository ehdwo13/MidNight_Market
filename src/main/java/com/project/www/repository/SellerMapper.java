package com.project.www.repository;

import com.project.www.domain.ProductVO;
import com.project.www.domain.SellerVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SellerMapper {
    int register(SellerVO sellerVO);

    int checkId(String id);

    int checkShopName(String shopName);

    SellerVO findById(String id);

    List<SellerVO> getList();

    String getShopName(String sellerId);

    String getSellerId(String marketName);
}
