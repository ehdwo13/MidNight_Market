package com.project.www.service;

import com.project.www.domain.OrdersVO;
import com.project.www.domain.PaymentDTO;
import com.siot.IamportRestClient.response.Payment;

public interface PaymentService {

    String post(PaymentDTO paymentDTO);

    PaymentDTO getMyPaymentProduct(String merchantUid);

    String basketPost(PaymentDTO paymentDTO);

    int paySuccessUpdate(PaymentDTO paymentDTO);

    String refundUpdate(OrdersVO ordersVO);

    String saveMembershipPaymentInfo(PaymentDTO paymentDTO);

    int membershipRegistrationCompletedUpdate(PaymentDTO paymentDTO);

    void usedPointAndCouponUpdate(PaymentDTO paymentDTO);
}
