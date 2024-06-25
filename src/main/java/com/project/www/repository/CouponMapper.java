package com.project.www.repository;

import com.project.www.domain.CouponVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CouponMapper {
    int insert(CouponVO cvo);

    List<CouponVO> getList();

    long search(String couponCode);

    CouponVO getCouponList(long tmpCouponId);

    CouponVO getUsedCoupon(long usedCouponId);
}
