package com.project.www.service;

import com.project.www.config.oauth2.PrincipalDetails;
import com.project.www.domain.CustomerVO;
import com.project.www.domain.NotificationVO;
import com.project.www.domain.OrdersVO;
import com.project.www.repository.CustomerMapper;
import com.project.www.repository.OrdersMapper;
import com.project.www.repository.ProductMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrdersServiceImple implements OrdersService {

    private final OrdersMapper ordersMapper;
    private final ProductMapper productMapper;
    private final CustomerMapper customerMapper;
    private final NotificationService nsv;

    @Transactional
    @Override
    public List<OrdersVO> getMyPurchasedProductList(String customerId) {

        List<OrdersVO> ordersVOList = ordersMapper.getMyPurchasedProductList(customerId);

        for (OrdersVO ordersVO : ordersVOList) {
            ordersVO.setProductVO(productMapper.getDetail(ordersVO.getProductId()));
        }
        return ordersVOList;
    }

    @Transactional
    @Override
    public List<OrdersVO> getMyFrequentPurchasesList(String customerId) {
        List<OrdersVO> ordersVOList = ordersMapper.getMyFrequentPurchasesList(customerId);

        for (OrdersVO ordersVO : ordersVOList) {
            ordersVO.setProductVO(productMapper.getDetail(ordersVO.getProductId()));
        }

        return ordersVOList;
    }

    @Override
    public List<OrdersVO> getMyWriteReviewList(String customerId) {
        List<OrdersVO> ordersVOList = ordersMapper.getMyWriteReviewList(customerId);

        for (OrdersVO ordersVO : ordersVOList) {
            ordersVO.setProductVO(productMapper.getDetail(ordersVO.getProductId()));
        }
        return ordersVOList;
    }

    @Override
    public List<OrdersVO> getList() {
        return ordersMapper.getList();
    }

    @Transactional
    @Override
    public String confirmOrderUpdate(OrdersVO ordersVO) {

        int isOk;

        try {
            ordersVO = ordersMapper.selectOne(ordersVO.getId());
            CustomerVO customerVO = customerMapper.selectOne(ordersVO.getCustomerId());

            boolean isMembership = customerVO.isMStatus();
            long point = customerVO.getPoint();
            long payPrice = ordersVO.getPayPrice();
            long addedPoints = 0;
            String resultInfo = "";
            boolean mStatus = customerVO.isMStatus();

            if(isMembership){ //멤버쉽이 있다면
                customerVO.setPoint(point + Math.round(payPrice * 0.05));
                addedPoints = Math.round(payPrice * 0.05);
            }

            if(!isMembership){//멤버쉼이 없다면
                customerVO.setPoint(point + Math.round(payPrice * 0.01));
                addedPoints = Math.round(payPrice * 0.01);
            }
            NotificationVO nvo = new NotificationVO();

            nvo.setCustomerId(customerVO.getId());
            nvo.setNotifyContent("구매확정 포인트 "+addedPoints+"점 적립이 완료되었습니다. ");
            nsv.insert(nvo);


            int ordersUpdateResult = ordersMapper.confirmOrderUpdate(ordersVO);
            int customerUpdateResult = customerMapper.pointUpdate(customerVO);

            if (ordersUpdateResult == 0 || customerUpdateResult == 0) {
                throw new RuntimeException("주문확정에 실패하였습니다.");
            }

            //PrincipalDetails 객체 업데이트
            //Authentication 객체가 null이 아니고, 인증된 사용자의 principal이 PrincipalDetails 타입일 경우
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); //객체생성
            if(authentication != null && authentication.getPrincipal() instanceof PrincipalDetails){
                PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal(); //객체 가져옴
                principalDetails.updatePoints(point + addedPoints); //포인트 업데이트
            }

            if(mStatus){ //멤버쉽 회원일 경우
                resultInfo = "(멤버쉽 혜택 적용!! 5% 적립)\n"+addedPoints+"포인트가 적립되었습니다/"+addedPoints;
            }

            if(!mStatus){
                resultInfo = addedPoints+"포인트가 적립되었습니다/"+addedPoints;
            }

            return resultInfo;

        } catch (RuntimeException e) {
            e.printStackTrace();
            return "fail";
        }

    }

    @Override
    public List<OrdersVO> getMyList(String currentId) {
        return ordersMapper.getMyList(currentId);
    }
}
