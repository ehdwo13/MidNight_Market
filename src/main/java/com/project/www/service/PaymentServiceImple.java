package com.project.www.service;

import com.project.www.domain.BasketVO;
import com.project.www.domain.OrdersVO;
import com.project.www.domain.PaymentDTO;
import com.project.www.domain.ProductVO;
import com.project.www.repository.BasketMapper;
import com.project.www.repository.OrdersMapper;
import com.project.www.repository.PaymentMapper;
import com.project.www.repository.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class PaymentServiceImple implements PaymentService {

    private final PaymentMapper paymentMapper;
    private final ProductMapper productMapper;
    private final OrdersMapper ordersMapper;
    private final BasketMapper basketMapper;


    @Transactional
    @Override
    public String post(PaymentDTO paymentDTO) {

        ProductVO productVO = productMapper.getDetail(paymentDTO.getProductId());

        //재고 소진시 주문 취소
        if (productVO.getTotalQty() == 0) {
            return "quantity_exhaustion";
        }

        //잔여개수보다 주문개수가 많을 경우 주문 취소
        if (productVO.getTotalQty() < paymentDTO.getQty()) {
            return "excess_quantity" + productVO.getTotalQty();
        }

        //UID, customerId, payDescription, payPrice입력
        //상품설명 저장
        paymentDTO.setPayDescription(productVO.getName() + paymentDTO.getQty() + " 개");
        //할인되기 전 가격 저장 (할인금액 구하기 위해)
        paymentDTO.setOriginalPrice(productVO.getPrice() * paymentDTO.getQty());
        //결제할 가격 저장
        paymentDTO.setPayPrice(productVO.getDiscountPrice() * paymentDTO.getQty());

        OrdersVO ordersVO = new OrdersVO();
        ordersVO.setMerchantUid(paymentDTO.getMerchantUid());
        ordersVO.setCustomerId(paymentDTO.getCustomerId());
        ordersVO.setProductId(paymentDTO.getProductId());
        ordersVO.setQty(paymentDTO.getQty());
        ordersVO.setPayPrice(paymentDTO.getQty() * productVO.getDiscountPrice());
        
        paymentMapper.register(paymentDTO);
        ordersMapper.register(ordersVO);
        //상품의 quantity 도 주문한 갯수만큼 수정
        productMapper.orderUpdate(ordersVO);

        return "success";
    }

    @Transactional
    @Override
    public PaymentDTO getMyPaymentProduct(String merchantUid) {

        //주문 정보도 가져와야함
        PaymentDTO paymentDTO = paymentMapper.getMyPaymentProduct(merchantUid);
        paymentDTO.setOrdersList(ordersMapper.getMyOrdersProduct(merchantUid));

        //상품정보 가져오기 (이미지)
        for (OrdersVO ordersVO : paymentDTO.getOrdersList()) {
            ordersVO.setProductVO(productMapper.getDetail(ordersVO.getProductId()));
        }

        return paymentDTO;
    }

    @Transactional
    @Override
    public String basketPost(PaymentDTO paymentDTO) {

        //내 장바구니 리스트
        List<BasketVO> basketList = basketMapper.getMyBasket(paymentDTO.getCustomerId());
        List<ProductVO> productList = new ArrayList<>();

        String productName = "";
        long productCount = -1;
        long originalPrice = 0;
        long payPrice = 0;

        for (BasketVO bsv : basketList) {

            //상품 정보 리스트에 저장
            ProductVO productVO = productMapper.getDetail(bsv.getProductId());

            //수량 초과이면 저장되게 하지 못하게 막아야함
            if (bsv.getQty() > productVO.getTotalQty()) {
                return "excess_quantity";
            }
            //상단에 이름 저장하기위해 수량이 0이 아닌 상품의 이름을 가져옴
            if (bsv.getQty() != 0) {
                productName = productVO.getName();
                productCount += 1;
            }
            originalPrice += bsv.getQty() * productVO.getPrice();
            payPrice += bsv.getQty() * productVO.getDiscountPrice();

            //리스트에 저장
            productList.add(productVO);

        }

        paymentDTO.setPayDescription(productName + " 외 (" + productCount + " 개)");
        paymentDTO.setOriginalPrice(originalPrice);
        paymentDTO.setPayPrice(payPrice);
        paymentMapper.register(paymentDTO);

        for (int i = 0; i < basketList.size(); i++) {

            //장바구니에 있는 상품 개수가 0이면 결제에 추가 안돼게
            if (basketList.get(i).getQty() != 0) {

                //UID, customerId, payDescription, payPrice입력
                //상품설명 저장
                //할인되기 전 가격 저장 (할인금액 구하기 위해)
                //결제할 가격 저장

                OrdersVO ordersVO = new OrdersVO();
                ordersVO.setMerchantUid(paymentDTO.getMerchantUid());
                ordersVO.setCustomerId(paymentDTO.getCustomerId());
                ordersVO.setProductId(basketList.get(i).getProductId());
                ordersVO.setQty(basketList.get(i).getQty());
                ordersVO.setPayPrice(basketList.get(i).getQty() * productList.get(i).getDiscountPrice());
                ordersMapper.register(ordersVO);

                //주문이 들어가면 기존에 있던 장바구니 목록 삭제
                BasketVO basketVO = new BasketVO();
                basketVO.setCustomerId(ordersVO.getCustomerId());
                basketVO.setProductId(ordersVO.getProductId());
                basketMapper.delete(basketVO);
                //상품의 quantity 도 주문한 갯수만큼 수정
                productMapper.orderUpdate(ordersVO);
            }
        }

        return "post_success";
    }

    @Transactional
    @Override
    public int paySuccessUpdate(PaymentDTO paymentDTO) {
        int isOk = paymentMapper.paySuccessUpdate(paymentDTO);

        if(isOk > 0){
            ordersMapper.paySuccessUpdate(paymentDTO.getMerchantUid());
            return 1;
        }

        return 0;
    }
}
