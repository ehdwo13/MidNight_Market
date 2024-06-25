// localStorage에서 'merchantUid' 가져오기
const merchantUid = localStorage.getItem('merchantUid');
const payPrice = 100;
const email = customerId.replace(/\([^)]*\)/g, '');
// 'merchantUid' 데이터 삭제하기
localStorage.removeItem('merchantUid');
$(document).ready(function () { //사전검증 요청
    $.ajax({
        url: "/payment/prepare",
        method: "post",
        contentType: "application/json",
        data: JSON.stringify({
            merchantUid: merchantUid, // 가맹점 주문번호
            payPrice: payPrice // 결제 예정금액
        })
    });
});


document.getElementById('membership-paymentButton').addEventListener('click', () => {

    let IMP = window.IMP;
    IMP.init('imp53054186');

    IMP.request_pay({
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: merchantUid,
        name: '멤버쉽 결제',
        amount: payPrice,
        buyer_email: email,
        buyer_name: nickName
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
                $.ajax({
                    url: '/payment/membershipRegistrationCompletedUpdate',
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        customerId: customerId,
                        merchantUid: rsp.merchant_uid,
                        payMethod: rsp.pay_method
                        // 주소와 전화번호와 같은 정보 기입
                    }),
                    success: function (response) {
                        alert('결제에 성공하였습니다.\n멤버쉽 가입을 축하합니다~');
                        window.close();
                        opener.location.reload();
                    },
                    error: function (xhr, status, error) {
                        // 요청이 실패했을 때 실행되는 코드
                        alert("걸제가 실패하였습니다. :", status, error);
                        window.close();
                    },
                    complete: function (xhr, status) {
                        // 요청이 완료되었을 때 (성공 또는 실패 모두 포함) 실행되는 코드
                    }
                });

            })
        } else {
            alert('결제에 실패하였습니다.\n다시 시도해주세요.\n에러 내용: ' + rsp.error_msg);
            // 결제 실패 후 처리
            window.close();
        }
    });
});