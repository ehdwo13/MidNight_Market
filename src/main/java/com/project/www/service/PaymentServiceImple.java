package com.project.www.service;

import com.project.www.config.oauth2.PrincipalDetails;
import com.project.www.domain.*;
import com.project.www.repository.*;
import com.siot.IamportRestClient.exception.IamportResponseException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class PaymentServiceImple implements PaymentService {

    private final ImportService importService;
    private final PaymentMapper paymentMapper;
    private final ProductMapper productMapper;
    private final OrdersMapper ordersMapper;
    private final BasketMapper basketMapper;
    private final CustomerMapper customerMapper;
    private final NotificationService nsv;
    private final AddressMapper addressMapper;
    private final CouponMapper couponMapper;
    private final MemberCouponMapper memberCouponMapper;


    @Transactional
    @Override
    public String post(PaymentDTO paymentDTO) {

        //주문하려는 상품 객체 가져오기
        ProductVO productVO = productMapper.getDetail(paymentDTO.getProductId());

        long productQuantity = productVO.getTotalQty(); //상품 수량
        long paymentQuantity = paymentDTO.getQty(); //결제할 수량
        long originalPayment = productVO.getPrice() * paymentQuantity; //기존 결제가격
        long discountPayment = productVO.getDiscountPrice() * paymentQuantity; //할인된 결제가격

        //재고 소진시 주문 취소
        if (productQuantity == 0) {
            return "quantity_exhaustion";
        }

        //잔여개수보다 주문개수가 많을 경우 주문 취소
        if (productQuantity < paymentQuantity) {
            return "excess_quantity" + productVO.getTotalQty();
        }

        try {
            //결제 정보 객체에 저장
            paymentDTO.setPayDescription(productVO.getName() + "  " + paymentQuantity + "개"); //상품결제 설명 저장
            paymentDTO.setOriginalPrice(originalPayment); //할인되기 전 기존가격 저장 (할인금액 구하기 위해)
            paymentDTO.setPayPrice(discountPayment); //실제 결제가격 저장

            //주문정보 저장
            OrdersVO orders = OrdersVO.builder()
                    .merchantUid(paymentDTO.getMerchantUid())
                    .customerId(paymentDTO.getCustomerId())
                    .productId(paymentDTO.getProductId())
                    .qty(paymentQuantity)
                    .originalPrice(discountPayment)
                    .payPrice(discountPayment)
                    .build();

            int isOk = 1;
            isOk *= paymentMapper.register(paymentDTO); // 결제 정보 등록
            isOk *= ordersMapper.register(orders); // 주문 정보 등록
            isOk *= productMapper.orderUpdate(orders); // 상품 수량 업데이트
            //여기에 알림 로직 추가

            if (isOk == 0) {
                throw new RuntimeException("Failed to process payment and order.");
            }

            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "fail";
        }
    }

    @Transactional
    @Override
    public PaymentDTO getMyPaymentProduct(String merchantUid) {

        PaymentDTO paymentDTO = paymentMapper.getMyPaymentProduct(merchantUid); //결제정보
        paymentDTO.setOrdersList(ordersMapper.getMyOrdersProduct(merchantUid)); //주문정보들 (장바구니 정보일경우 주문정보 여러개)
        paymentDTO.setAddressVO(addressMapper.getIsMain(paymentDTO.getCustomerId()));

        //상품정보 가져오기 (이미지)
        paymentDTO.getOrdersList().forEach(orders -> {
            orders.setProductVO(productMapper.getDetail(orders.getProductId()));
        });

        return paymentDTO;
    }

    @Transactional
    @Override
    public String basketPost(PaymentDTO paymentDTO) {

        try {
            String productName = "";
            long productCount = -1;
            long originalPrice = 0;
            long payPrice = 0;
            long productQuantity = 0;

            // 내 장바구니 리스트
            List<BasketVO> basketList = basketMapper.getReadyToCheckoutCartItems(paymentDTO.getCustomerId());
            List<ProductVO> productList = new ArrayList<>();

            if (basketList == null || basketList.isEmpty()) {
                return "quantity_exhaustion";
            }

            for (BasketVO bsv : basketList) {
                ProductVO productVO = productMapper.getDetail(bsv.getProductId());//상품 정보 리스트에 저장

                if (bsv.getQty() > productVO.getTotalQty()) {//수량 초과이면 저장되게 하지 못하게 막아야함
                    return "excess_quantity";
                }

                if (bsv.getQty() != 0 && bsv.isChecked()) {//상단에 이름 저장하기위해 수량이 0이 아닌 상품의 이름을 가져오고 체크박스를 클릭한 상품만 넣기
                    productName = productVO.getName();
                    productCount += 1;
                    productQuantity = bsv.getQty();
                }
                originalPrice += bsv.getQty() * productVO.getPrice();
                payPrice += bsv.getQty() * productVO.getDiscountPrice();

                //리스트에 저장
                productList.add(productVO);
            }

            paymentDTO.setPayDescription(productName + "  " + (productCount <= 0 ? productQuantity + " 개" : " 외 (" + productCount + " 개)"));
            paymentDTO.setOriginalPrice(originalPrice);
            paymentDTO.setPayPrice(payPrice);

            int isOk = paymentMapper.register(paymentDTO);

            for (int i = 0; i < basketList.size(); i++) {
                if (basketList.get(i).getQty() != 0) {//장바구니에 있는 상품 개수가 0이면 결제에 추가 안돼게
                    OrdersVO ordersVO = OrdersVO.builder()
                            .merchantUid(paymentDTO.getMerchantUid())  //상품고유번호
                            .customerId(paymentDTO.getCustomerId()) //고객아이디
                            .productId(basketList.get(i).getProductId()) //상품번호
                            .qty(basketList.get(i).getQty()) //구매하려는 상품 개수
                            .originalPrice(basketList.get(i).getQty() * productList.get(i).getDiscountPrice())
                            .payPrice(basketList.get(i).getQty() * productList.get(i).getDiscountPrice()) //구매하려는 상품 가격
                            .build();

                    isOk *= ordersMapper.register(ordersVO); // 주문 정보 등록
                    isOk *= productMapper.orderUpdate(ordersVO); //상품의 quantity 도 주문한 갯수만큼 수정
                }
            }

            if (isOk == 0) {
                throw new RuntimeException("Failed to process payment and order.");
            }

            return "post_success";
        } catch (Exception e) {
            e.printStackTrace();
            return "post_fail";
        }
    }


    @Transactional
    @Override
    public int paySuccessUpdate(PaymentDTO paymentDTO) {
        try {
            int isOk = paymentMapper.paySuccessUpdate(paymentDTO); //결제 테이블 업데이트

            long usedCouponAmount = paymentDTO.getUsedCouponAmount(); //사용한 쿠폰 가격
            long usedPoint = paymentDTO.getUsedPoint(); //사용한 포인트
            long combinedDiscount = usedCouponAmount + usedPoint; // 쿠폰가격 + 사용한 포인트

            List<OrdersVO> ordersVOList = ordersMapper.findExpiredOrders(paymentDTO.getMerchantUid()); //해당 merchantUid 상품들 가져온다.

            if (combinedDiscount != 0) {//포인트나 쿠폰을 사용했을경우
                //여기서 가격을 업데이트해서 결제금액을 orders table에 업데이트 시켜주어야 한다.
                for (OrdersVO ordersVO : ordersVOList) {
                    long calcPrice = Math.round(((float) ordersVO.getPayPrice() / paymentDTO.getOriginalPrice()) * paymentDTO.getPayPrice());  // 상품가격 / 총금액 * 구매가격
                    ordersVO.setImpUid(paymentDTO.getImpUid());
                    ordersVO.setPayPrice(calcPrice); //포인트와 쿠폰이 적용된 할인가격을 넣어줌
                    ordersMapper.usedCombineDiscountUpdate(ordersVO); //포인트와 쿠폰이 적용도니 할인가격을 업데이트
                }

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
                principalDetails.updatePoints(principalDetails.getPoint() - usedPoint); // principal 객체에 포인트 사용 업데이트

                CustomerVO customerVO = CustomerVO.builder() //Customer 객체 생성
                        .id(paymentDTO.getCustomerId())
                        .point(usedPoint)
                        .build();

                MemberCouponVO memberCouponVO = MemberCouponVO.builder() //MemberCoupone 객체 생성
                        .customerId(paymentDTO.getCustomerId())
                        .couponId(paymentDTO.getUsedCouponId())
                        .build();

                isOk *= customerMapper.usedPointUpdate(customerVO); //사용한포인트 차감하기
                isOk *= memberCouponMapper.usedCouponUpdate(memberCouponVO); //사용한 쿠폰 못쓰게 하기
            }

            isOk *= ordersMapper.paySuccessUpdate(paymentDTO);  //주문 성공 업데이트

            if (ordersVOList.size() > 1) { //여러개 상품을 주문했을경우 (장바구니 이용시)
                isOk *= basketMapper.clearBasketOnPaymentSuccess(paymentDTO.getCustomerId());//결제 성공하고 결제한 장바구니 지우기
            }

            NotificationVO nvo = new NotificationVO();
            nvo.setCustomerId(paymentDTO.getCustomerId());
            nvo.setNotifyContent(paymentDTO.getPayDescription() + " 주문이 완료되었습니다. ");
            nsv.insert(nvo);
            if (isOk == 0) {
                throw new RuntimeException();
            }
            return isOk;
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }


    @Transactional
    @Override
    public String refundUpdate(OrdersVO ordersVO) {

        try {
            ordersVO = ordersMapper.selectOne(ordersVO.getId()); // 환불할 주문 객체 가져오기
            PaymentDTO paymentDTO = paymentMapper.getMyPaymentProduct(ordersVO.getMerchantUid()); // 부분 환불될 결제 금액 가져오기
            long refundPoint = 0; //환불하면 지급받는 포인트
            int isOk = 1;

            ProductVO productVO = ProductVO.builder()
                    .totalQty(ordersVO.getQty()) // 환불될 상품 수량
                    .id(ordersVO.getProductId())  // 환불될 상품 번호
                    .build();

            String merchantUid = paymentDTO.getMerchantUid(); // 결제 주문 번호
            String impUid = ordersVO.getImpUid();
            long amount = ordersVO.getPayPrice(); // 환불 금액
            BigDecimal checksum = BigDecimal.valueOf(paymentDTO.getPayPrice() - ordersVO.getOriginalPrice()); // 환불하고 남은 금액 (부분 환불)

            importService.refundPaymentByMerchantUid(impUid, amount, checksum);

            if(paymentDTO.getUsedPoint() != 0 || paymentDTO.getUsedCouponId() != 0){ //쿠폰이나 포인트를 사용했을 경우


                long usedCouponId = 0; //사용한 쿠폰 아이디
                long usedCouponAmount = 0; //사용한 쿠폰 가격
                long usedPoint = paymentDTO.getUsedPoint(); //사용한 포인트

                if(paymentDTO.getUsedCouponId() != 0){
                CouponVO couponVO = couponMapper.getUsedCoupon(paymentDTO.getUsedCouponId()); //사용한 쿠폰 가져와서 할인가격 알아오기
                    usedCouponId = paymentDTO.getUsedCouponId();
                    usedCouponAmount = couponVO.getDiscountAmount();
                }

                long combinedDiscount = usedCouponAmount + usedPoint; // 쿠폰가격 + 사용한 포인트

                double payPricePointRefundPercent = (double) ordersVO.getOriginalPrice()/ paymentDTO.getPayPrice();//결제가격 포인트 환불 퍼센트 (결제한 원래 상품가격) / (상품 총결제금액)
                refundPoint = Math.round(combinedDiscount * payPricePointRefundPercent); //환불 포인트 계산

                CustomerVO customerVO = CustomerVO.builder() //객체생성
                        .id(paymentDTO.getCustomerId())
                        .point(refundPoint)
                        .build();

                isOk *= customerMapper.rollbackRefundPoint(customerVO);

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null && authentication.getPrincipal() instanceof PrincipalDetails) {
                    PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
                    principalDetails.updatePoints(principalDetails.getPoint() + refundPoint); //Principal 객체에도 환불된 포인트 추가하여 업데이트
                }
            }

            // 환불시 결제 DB 업데이트
            paymentDTO.setPayPrice(paymentDTO.getPayPrice() - ordersVO.getOriginalPrice()); // 결제하고 남은 금액
            ordersVO.setPayPrice(amount); // 결제한 금액

//            isOk *= paymentMapper.refundUpdate(paymentDTO); //
            isOk *= ordersMapper.refundUpdate(ordersVO);
            isOk *= productMapper.rollbackRefundQuantity(productVO);

            NotificationVO nvo = new NotificationVO();
            nvo.setCustomerId(paymentDTO.getCustomerId());
            ProductVO pvo = productMapper.getDetail(ordersVO.getProductId());
            String productName = pvo.getName();
            nvo.setNotifyContent(productName + " 의 환불이 완료되었습니다. ");
            nsv.insert(nvo);
            if (isOk == 0) {
                throw new RuntimeException("환불 처리에 실패했습니다.");
            }
            DecimalFormat df = new DecimalFormat("#,###");
            return df.format(ordersVO.getPayPrice()) + "원이 정상적으로 환불되었습니다.\n환급된 포인트 : " + df.format(refundPoint)+"원";
        } catch (IamportResponseException | IOException | RuntimeException e) {
            return "Refund failed :" + e.getMessage();
        }


    }

    @Override
    public String saveMembershipPaymentInfo(PaymentDTO paymentDTO) {
        paymentDTO.setPayPrice(100);
        paymentDTO.setOriginalPrice(100);
        paymentDTO.setPayDescription("멤버쉽결제");

        int isOk = paymentMapper.register(paymentDTO);
        return isOk > 0 ? "success" : "fail";
    }

    @Transactional
    @Override
    public int membershipRegistrationCompletedUpdate(PaymentDTO paymentDTO) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof PrincipalDetails) {
            PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
            principalDetails.updateMStatus(true); // 멤버십 가입유무
        }
        try {
            int isOk = paymentMapper.paySuccessUpdate(paymentDTO);
            isOk *= customerMapper.memberShipJoinUpdate(paymentDTO);

            if (isOk == 0) {
                new RuntimeException("멤버십 가입 중 오류 발생");
            }
        } catch (RuntimeException e) {
            e.printStackTrace();
            return -1;
        }

        return 1;
    }

    @Override
    public void usedPointAndCouponUpdate(PaymentDTO paymentDTO) {
        paymentMapper.usedPointAndCouponUpdate(paymentDTO);
    }
}
