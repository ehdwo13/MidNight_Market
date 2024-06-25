const email = paymentDTO.customerId.replace(/\([^)]*\)/g, '');

if (pointVal === 0 && couponList.length === 0) { //포인트랑 쿠폰이 없을경우 바로 사전등록
    $(document).ready(function () {
        $.ajax({
            url: "/payment/prepare",
            method: "post",
            contentType: "application/json",
            data: JSON.stringify({
                merchantUid: paymentDTO.merchantUid, // 가맹점 주문번호
                payPrice: paymentDTO.payPrice // 결제 예정금액
            })
        });
    });
}

document.getElementById('purchaseButton').addEventListener('click', (e) => {

    e.preventDefault(); //이벤트 취소

    const checkboxes = document.querySelectorAll('.checkbox');

    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

    if(!allChecked){
        alert('약관 동의를 모두 하고 결제를 진행해주세요.');
        return;
    }



    const finalPaymentPrice = payPrice - usedPoint - usedCoupon;

    $(document).ready(function () { //쿠폰 및 포인트 사용시 사용한 쿠폰 포인트 합산해서 사전등록
        $.ajax({
            url: "/payment/prepare",
            method: "post",
            contentType: "application/json",
            data: JSON.stringify({
                merchantUid: paymentDTO.merchantUid, // 가맹점 주문번호
                payPrice: finalPaymentPrice, // 결제 예정금액
                usedCouponId : usedCouponId,
                usedPoint : usedPoint
            })
        });
    });


    const data = {
        merchantUid: paymentDTO.merchantUid,
        amount: finalPaymentPrice,
        tel: '010-1234-5678',
        address: '경기도 인천시 제주도구'
    }

    let IMP = window.IMP; // Iamport 객체 초기화
    IMP.init('imp53054186'); // 가맹점 식별코드

    IMP.request_pay({
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: paymentDTO.merchantUid,
        name: paymentDTO.payDescription,
        amount: finalPaymentPrice,
        buyer_email: email,
        buyer_name: nickName,
        buyer_addr: '인천시 제주도 광역시',
    }, function (rsp) {
        if (rsp.success) {
            $.ajax({
                url: '/payment/validate',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    impUid: rsp.imp_uid,
                    merchantUid: rsp.merchant_uid,
                }),
            }).done(function (data) {
                //사후 검증 완료 후
                //성공하면 DB데이터 세부사항 저장해야 한다 : 주소,전화번호, 결제방식 등등 업데이트
                $.ajax({
                    url: '/payment/successUpdate',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        merchantUid: rsp.merchant_uid,
                        impUid: rsp.imp_uid,
                        payMethod: rsp.pay_method,
                        payDescription: paymentDTO.payDescription,
                        customerId: paymentDTO.customerId,
                        originalPrice : payPrice,
                        payPrice : finalPaymentPrice,
                        usedPoint : usedPoint,
                        usedCouponAmount : usedCoupon,
                        usedCouponId : usedCouponId

                        // 주소와 전화번호와 같은 정보 기입
                    }),
                    success: function (response) {
                        alert('결제가 성공적으로 완료되었습니다');
                        location.href = '/payment/success/' + rsp.merchant_uid;
                    },
                    error: function (xhr, status, error) {
                        // 요청이 실패했을 때 실행되는 코드
                        console.error("걸제가 실패하였습니다. :", status, error);
                    },
                    complete: function (xhr, status) {
                        // 요청이 완료되었을 때 (성공 또는 실패 모두 포함) 실행되는 코드
                    }
                });

            })
        } else {
            alert('결제에 실패하였습니다.\n에러 내용: ' + rsp.error_msg);
            // 결제 실패 후 처리
        }
    });
});


// 배송 요청사항 직접입력시
function selectChange() {
    let selectAddr = document.getElementById('selectAddr');
    let customerInput = document.getElementById('customerInput');

    // "직접 입력"을 선택시 input
    if (selectAddr.value === 'directInput') {
        customerInput.style.display = 'inline';
        customerInput.style.paddingLeft = '20px';
        customerInput.value = '';
        customerInput.focus();
    } else {
        customerInput.style.display = 'none';
    }
}

// 새로운 값 직접 입력 받기
function selectChangeHandler() {
    let selectAddr = document.getElementById('selectAddr');
    let customerInput = document.getElementById('customerInput');
    let directInputOption = selectAddr.querySelector('option[value="directInput"]');

    let trimmedValue = customerInput.value.trim(); // 입력 받은 값 양쪽 끝 공백 제거
    // 입력 받은 값이 공백이 아닌 경우만
    if (trimmedValue !== '') {
        // 직접 입력 옵션 유지하면서 새로운 값만 추가(공백만 있는거 안됨)
        if (!isOption(selectAddr, trimmedValue)) {
            let newOption = document.createElement('option'); // 옵션 요소 추가
            newOption.value = trimmedValue; // 옵션 요소 value는 새로 입력한 값
            newOption.text = trimmedValue;
            selectAddr.appendChild(newOption); // select안에 만든 옵션값 추가
        }
        // 새 값으로 "직접 입력" 옵션 설정
        directInputOption.text = '직접 입력';
        directInputOption.value = 'directInput';
        selectAddr.value = trimmedValue;
    }
    customerInput.style.display = 'none';
}

// 해당 값이 이미 옵션에 있는지 확인
function isOption(selectAddr, value) {
    let options = selectAddr.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === value) {
            return true;
        }
    }
    return false;
}

// 배송비 변경 클릭시 팝업
let addrModifyBtn = document.getElementById('addrModifyBtn');

// 버튼 클릭시 팝업 보이게
addrModifyBtn.addEventListener('click', () => {
    window.open('/payment/addrModifyPopup', '배송지 변경', 'width=800,height=600,left=340px,top=80px');
});
