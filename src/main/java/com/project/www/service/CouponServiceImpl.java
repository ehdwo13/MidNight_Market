package com.project.www.service;

import com.project.www.domain.CouponVO;
import com.project.www.repository.CouponMapper;
import com.project.www.repository.MemberCouponMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CouponServiceImpl implements CouponService{

    private final CouponMapper couponMapper;
    private final MemberCouponMapper memberCouponMapper;

    @Override
    public int insert(CouponVO cvo) {
        return couponMapper.insert(cvo);
    }

    @Override
    public List<CouponVO> getList() {
        return couponMapper.getList();
    }

    @Override
    public long search(String couponCode) {
        return couponMapper.search(couponCode);
    }

    @Override
    public CouponVO getCouponList(long tmpCouponId) {
        return couponMapper.getCouponList(tmpCouponId);
    }
}
