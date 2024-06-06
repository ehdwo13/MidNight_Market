package com.project.www.service;

import com.project.www.domain.PaymentDTO;
import com.siot.IamportRestClient.response.Payment;

public interface PaymentService {

    String post(PaymentDTO paymentDTO);

    PaymentDTO getMyPaymentProduct(String merchantUid);

    String basketPost(PaymentDTO paymentDTO);

    int paySuccessUpdate(PaymentDTO paymentDTO);
}
