package com.project.www.service;

import com.project.www.domain.MemberCouponVO;
import com.project.www.repository.MemberCouponMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class MemberCouponServiceImpl implements MemberCouponService{
    private final MemberCouponMapper memberCouponMapper;

    @Override
    public int addCoupon(String customerId, String couponId) {
        return memberCouponMapper.addCoupon(customerId, couponId);
    }

    @Override
    public List<MemberCouponVO> getMemberCouponList(String customerId) {
        return memberCouponMapper.getMemberCouponList(customerId);
    }

    @Override
    public Boolean isExist(long couponId, String customerId) {
        return memberCouponMapper.isExist(couponId, customerId) > 0;
    }

    @Override
    public int getCount(String customerId) {
        return memberCouponMapper.getCount(customerId);
    }
}
