package com.project.www.scheduler;

import com.project.www.domain.OrdersVO;
import com.project.www.domain.ProductVO;
import com.project.www.repository.CustomerMapper;
import com.project.www.repository.OrdersMapper;
import com.project.www.repository.PaymentMapper;
import com.project.www.repository.ProductMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@EnableScheduling
public class Scheduler {

    @Autowired
    private PaymentMapper paymentMapper;

    @Autowired
    private OrdersMapper ordersMapper;

    @Autowired
    private CustomerMapper customerMapper;
    @Autowired
    private ProductMapper productMapper;

    //2분마다 주문확정, 또는 주문완료시 상태를 배송완료로 변경하는 스케쥴러
    @Scheduled(fixedRate = 120000) //2분마다
    public void markAsDelivered() {
        int deliveredCount = ordersMapper.markAsDelivered();
        //업데이트를하면 업데이트된 개수 받아와서
        // 배송완료 Count Limit 0, low 아이디 값 List로 받아오기
        List<String> getDeliveredCustomers = ordersMapper.getDeliveredCustomers(deliveredCount);
        log.info("배송완료된 고객아이디 확인>>>{}", getDeliveredCustomers);
        //배송완료되면 주문자에게 알림 추가
    }

    //30분마다 결제 대기인 상품 삭제 후 상품 수량 되돌려놓기
    @Transactional
    @Scheduled(fixedDelay = 1800000)
    public void deleteExpiredPayments() {

        try {

            LocalDateTime tenMinutesAgo = LocalDateTime.now().minusMinutes(30);

            int isOk = 1;

            List<String> expiredPayments = paymentMapper.findExpiredPayments(tenMinutesAgo); //결제를 안하고 30분이 지난 결제내역 가져오기

            log.info("결제안한 uid확인>>>{}",expiredPayments);

            for (String merchantUid : expiredPayments) {

                List<OrdersVO> ordersVOList = ordersMapper.findExpiredOrders(merchantUid); //결제안한 주문내역가져오기

                for (OrdersVO ordersVO : ordersVOList) {

                    //상품 수량 복구
                    ProductVO productVO = ProductVO.builder()
                            .id(ordersVO.getProductId()) //상품번호
                            .totalQty(ordersVO.getQty()) //반환될 상품개수
                            .build();
                    isOk *= productMapper.rollbackRefundQuantity(productVO); //반환하기
                }

                isOk *= paymentMapper.deleteExpiredPayments(merchantUid); //결제대기인 내역 삭제하기(자동으로 orders도 삭제)

            }

            if(isOk == 0){
                throw new RuntimeException("상품 결제대기 삭제중 오류발생");
            }

        }catch (RuntimeException e){
            e.printStackTrace();
            log.info("상품 결제대기 업데이트 실패!!{}",e.getMessage());
        }

    }

}
