package com.project.www.repository;

import com.project.www.domain.PaymentDTO;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface PaymentMapper {
    int register(PaymentDTO paymentDTO);

    PaymentDTO getMyPaymentProduct(String merchantUid);

    int paySuccessUpdate(PaymentDTO paymentDTO);

    int refundUpdate(PaymentDTO paymentDTO);

    List<String> findExpiredPayments(LocalDateTime tenMinutesAgo);

    int deleteExpiredPayments(String merchantUid);

    void usedPointAndCouponUpdate(PaymentDTO paymentDTO);
}
