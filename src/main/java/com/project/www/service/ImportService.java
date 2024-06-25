package com.project.www.service;

import com.project.www.domain.CouponVO;
import com.project.www.domain.MemberCouponVO;
import com.project.www.domain.PaymentDTO;
import com.project.www.repository.CouponMapper;
import com.project.www.repository.MemberCouponMapper;
import com.project.www.repository.PaymentMapper;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.request.CancelData;
import com.siot.IamportRestClient.request.PrepareData;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.IOException;
import java.math.BigDecimal;

@Slf4j
@Service
public class ImportService {

    private IamportClient api;

    @Autowired
    private PaymentMapper paymentMapper;

    @Autowired
    private CouponMapper couponMapper;

    @Autowired
    private MemberCouponMapper memberCouponMapper;

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
       CouponVO couponVO = couponMapper.getUsedCoupon(preparePaymentDTO.getUsedCouponId());
       int isUsedCoupon = memberCouponMapper.isExist(preparePaymentDTO.getUsedCouponId(), preparePaymentDTO.getCustomerId());

       long paid = preparePaymentDTO.getPayPrice(); //실제 가격을 가져옴

        if(paymentDTO.getUsedPoint() != 0){ //포인트를 사용했다면
            paid -= paymentDTO.getUsedPoint();
        }

        if(isUsedCoupon != 0){ //쿠폰을 사용했다면
            paid -= couponVO.getDiscountAmount();
        }

       BigDecimal preparePrice = BigDecimal.valueOf(paid); //DB에 저장되어있는 결제 금액

        IamportResponse<Payment> iamportResponse = api.paymentByImpUid(paymentDTO.getImpUid());
        BigDecimal paidPrice = iamportResponse.getResponse().getAmount(); //실제로 결제한 금액

        if(!preparePrice.equals(paidPrice)){ //가격이 불일치할경우 결제 취소
            CancelData cancelData = cancelPayment(iamportResponse);
        }

        return iamportResponse.getResponse();
    }

    public CancelData cancelPayment(IamportResponse<Payment> response){
        return new CancelData(response.getResponse().getImpUid(), true);
    }

    //merchantUid 환불 api
    public IamportResponse<Payment> refundPaymentByMerchantUid(String impUid, long amount, BigDecimal checksum) throws IOException, IamportResponseException{
        CancelData cancelData = new CancelData(impUid, true, BigDecimal.valueOf(amount));
        cancelData.setReason("그냥 환불하고 싶어요");
        IamportResponse<Payment> testData = api.cancelPaymentByImpUid(cancelData);
        return testData;
    }

}
