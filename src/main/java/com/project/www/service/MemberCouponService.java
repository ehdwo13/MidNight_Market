package com.project.www.service;

import com.project.www.domain.MemberCouponVO;

import java.util.List;

public interface MemberCouponService {

    int addCoupon(String customerId, String couponId);

    List<MemberCouponVO> getMemberCouponList(String customerId);

    Boolean isExist(long couponId, String customerId);

    int getCount(String customerId);
}
