package com.project.www.service;

import com.project.www.domain.PaymentDTO;
import com.project.www.repository.PaymentMapper;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.request.CancelData;
import com.siot.IamportRestClient.request.PrepareData;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.IOException;
import java.math.BigDecimal;

@Service
public class ImportService {

    private IamportClient api;

    @Autowired
    private PaymentMapper paymentMapper;

    public ImportService() {
        this.api = new IamportClient(
                "2045855176781372",
                "Ge0epYCqg47ZoTVdMM2eRUOqW2SOeHbiJw4E8e9nqGLP7N8BRXI0mWw1gsfvhunBq4fn2U2gCQUgBxWS");
    }



    public void postPrepare(@RequestBody PaymentDTO paymentDTO) throws IamportResponseException, IOException {

        PrepareData prepareData = new PrepareData(
                paymentDTO.getMerchantUid(),
                BigDecimal.valueOf(paymentDTO.getPayPrice()) // double 또는 long 타입일 경우
        );

        api.postPrepare(prepareData);

    }

    public Payment validatePaymnet(PaymentDTO paymentDTO) throws IamportResponseException, IOException {

        //현재 merchantUid로 DB에 저장된 가격 가져오기
       PaymentDTO preparePaymentDTO = paymentMapper.getMyPaymentProduct(paymentDTO.getMerchantUid());
       BigDecimal preparePrice = BigDecimal.valueOf(preparePaymentDTO.getPayPrice()); //DB에 저장되어있는 결제 금액

        IamportResponse<Payment> iamportResponse = api.paymentByImpUid(paymentDTO.getImpUid());
        BigDecimal paidPrice = iamportResponse.getResponse().getAmount(); //실제로 결제한 금액

        if(!preparePrice.equals(paidPrice)){
            CancelData cancelData = cancelPayment(iamportResponse);
        }

        return iamportResponse.getResponse();
    }

    public CancelData cancelPayment(IamportResponse<Payment> response){
        return new CancelData(response.getResponse().getImpUid(), true);
    }
}
