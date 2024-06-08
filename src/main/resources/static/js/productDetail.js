let productQty = document.getElementById('productQty');
let productPrice = document.getElementById('productPrice');

//수량이 1일 경우
if (1 === productDTO.productVO.totalQty) {
    document.getElementById('+').disabled = true;
    document.getElementById('max-quantity-notice').innerText = '최대수량입니다.'
    document.querySelector('.total-sum').innerText = '';
}

//받아왔을때 재고가 아예 없을 경우 두개의 버튼 버튼 비활성화
if(productDTO.productVO.totalQty === 0){
    document.getElementById('+').disabled = true;
    document.getElementById('-').disabled = true;
    document.getElementById('max-quantity-notice').innerText = '품절입니다.';
    document.querySelector('.total-sum').innerText = '';
    productQty.innerText = '0';
}

// + 또는 - 를 눌렀을 경우 가격 계산 
document.addEventListener('click', (e) => {
    
    //품절일 경우 이벤트 리턴
    if(productDTO.productVO.totalQty === 0){
        return;
    }

    //수량 추가 버튼
    if (e.target.id == '+') {

        productQty.innerText = Number(productQty.innerText) + 1; //수량 +1

        productPrice.innerText =
            (Number(productDTO.productVO.price) * Number(productQty.innerText))
                .toLocaleString('ko-KR') + ' 원';
    }

    //수량 감소 버튼
    if (e.target.id == '-') {
        //console.log('추가');
        productQty.innerText = Number(productQty.innerText) - 1; //수량 -1
        productPrice.innerText =
            (Number(productDTO.productVO.price) * Number(productQty.innerText))
                .toLocaleString('ko-KR') + ' 원';
    }


    //현재 주문할 수량이 잔여수량보다 크다면 + 비활성화
    if (Number(productQty.innerText) !== productDTO.productVO.totalQty) {
        document.getElementById('+').disabled = true;
        document.getElementById('max-quantity-notice').innerText = '최대 수량입니다.'
    }

    //주문개수가 1보다 커지면 - 버튼 활성화
    if (parseInt(productQty.innerText) > 1) {
        document.getElementById('-').disabled = false;
    } else {
        document.getElementById('-').disabled = true;
    }

    //주문개수가 잔여개수랑 같아질때 버튼 비활성화
    if (Number(productQty.innerText) !== productDTO.productVO.totalQty) {
        document.getElementById('+').disabled = false;
        document.getElementById('max-quantity-notice').innerText = ''
    } else {
        document.getElementById('+').disabled = true;
        document.getElementById('max-quantity-notice').innerText = '최대수량 입니다';
    }

});


//장바쿠니 버튼을 클릭했을 경우
document.getElementById('basketButton').addEventListener('click', () => {

    //재고가 0일경우 상품 주문 불가
    if(productDTO.productVO.totalQty === 0){
        alert(productDTO.productVO.name + ' 상품은 품절되었습니다.');
        return;
    }

    productData = {
        customerId: customerId, //고객이메일
        productId: Number(`${productDTO.productVO.id}`), //상품고유번호
        qty: Number(document.getElementById('productQty').innerText), //주문할 수량
    };

    $.ajax({
        type: 'POST',
        url: '/basket/register',
        contentType: 'application/json',
        data: JSON.stringify(productData),
        success: function (rsp) {
            console.log("응답 오느지 확인" + rsp);


            const message = rsp.replace(/\d+$/, '');
            const number = rsp.replace(/\D/g, '');

            //재고가 없을 경우
            if(number === '0'){
                alert(productDTO.productVO.name + ' 상품은 품절되었습니다.');
                document.getElementById('+').disabled = true;
                document.getElementById('-').disabled = true;
                document.getElementById('max-quantity-notice').innerText = '품절입니다.';
                document.querySelector('.total-sum').innerText = '';
                productQty.innerText = '0';
                return;
            }

            //장바구니에 넣을 때 수량이 초과일 경우
            if (message === 'excess_quantity') {
                if (confirm(`${productDTO.productVO.name} 상품은 최대 주문 수량이 ${number} 개 입니다. \n장바구니 페이지로 이동하시겠습니까?`)) {
                    location.href = '/basket/myBasket';
                }
            }

            //장바구니를 추가했을경우
            if (rsp === 'register_success') {
                if (confirm(`${productDTO.productVO.name}` + `를 장바구니에 저장했습니다. \n 장바구니 페이지로 이동하시겠습니까?`)) {
                    location.href = '/basket/myBasket';
                }
            }

            //더 담아넣을 경우
            if (message === 'update_success') {
                if (confirm(`한번더 담으셨네요! \n수량이 ${number} 개가 추가되었습니다. \n장바구니 페이지로 이동하시겠습니까?`)) {
                    location.href = '/basket/myBasket';
                }
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("에러: " + textStatus + ", " + errorThrown);
        }
    });
});

//찜하기 코드
document.getElementById('slangBtn').addEventListener('click', (e) => {
    const targetButton = e.target.closest('.like-button'); // 클릭된 요소가 like-button 클래스를 가진 버튼인지 확인
    if (targetButton) {
        //로그인을 안했을 시
        if(customerId == null){
            return;
        }
        if (targetButton.dataset.type === 'post') {
            slangInfoChange(customerId, productId, 'POST');
        }
        if (targetButton.dataset.type === 'delete') {
            slangInfoChange(customerId, productId, 'DELETE');
        }
        console.log(targetButton.id);
        console.log(targetButton.dataset.type);
    }
});


//찜하기 정보 요청
async function sendSlangUpdateServer(customerId, productId, type) {
    try {
        const response = await fetch('/product/slang/' + customerId + '/' + productId, {
            method: type, // 요청 방법 설정
            headers: {
                'Content-Type': 'application/json' // 요청 헤더 설정
            },
        });
        const result = await response.text();
        return result;
    } catch (error) {
        console.error('Error fetching product detail:', error);
    }
}


function slangInfoChange(customerId, productId, type) {

    sendSlangUpdateServer(customerId, productId, type).then(result => {

        console.log(result);

        let div = document.querySelector('.like-button');
        div.dataset.type = ''; // 데이터셋 속성 초기화
        let str = '';

        if (result == 'delete_success') {
            alert('찜하기 삭제 완료');
            str += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" class="bi bi-suit-heart" viewBox="0 0 16 16">`;
            str += `<path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>`;
            str += `</svg>`;
            div.dataset.type = 'post';
        }

        if (result == 'post_success') {
            alert('찜하기 완료');
            str += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="rgba(255, 0, 0, 0.685)" class="bi bi-heart-fill" viewBox="0 0 16 16">`;
            str += `<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>`;
            str += `</svg>`;
            div.dataset.type = 'delete';
        }
        div.innerHTML = str;
    });

}

//상품 주문하기 버튼 클릭 시 ->  성공하면 DB에 저장 후 주문페이지로 이동
document.getElementById('orderButton').addEventListener('click',(e)=>{

    const targetButton = e.target.closest('#orderButton'); // 클릭된 요소가 like-button 클래스를 가진 버튼인지 확인
    if(targetButton){

        const merchant_uid = 'merchent_uid' + new Date().getTime();
        //필요한 정보 : 고객 아이디, 상품아이디, 수량
        const payData = {
            merchantUid: merchant_uid,
            customerId: customerId,
            productId : productId,
            qty : parseInt(productQty.innerText)
        };

        postPaymentToServer(payData).then(result=>{
           console.log(result);

            const message = result.replace(/\d+$/, '');
            const number = result.replace(/\D/g, '');

           //잔여수량 보다 주문수량이 많을 시
           if(message == 'excess_quantity'){

               productQty.innerText = number;

               if(confirm(`${productDTO.productVO.name} 상품은 잔여수량이 ${number}개 남았습니다. \n${number}개로 주문하시겠습니까??`)){
                   postPaymentToServer(payData);
               }
                   document.getElementById('+').disabled = true;
           }
           
           //재고 없을 시
            if(message == 'quantity_exhaustion'){
                alert(productDTO.productVO.name + ' 상품은 품절되었습니다.');
            }
            
            //DB저장에 성공했을 시
            if(result == 'success'){
                alert('주문서 페이지로 이동합니다.');
                //form데이터 merchantUid를 order페이지에 보낸다
                document.getElementById('merchantUid').value = merchant_uid;
                document.getElementById('orderMoveForm').submit();
                
            }

        });
    }
});




async function postPaymentToServer(payData){

    try {

        const url = '/payment/post';
        const config = {
            method : 'POST',
            headers : {
                'content-type' : 'application/json; charset = utf-8'
            },
            body : JSON.stringify(payData)
        };

        const resp = await fetch(url,config);
        const result = await resp.text();
        return result;

    } catch (error) {
        console.log(error);
    }
}
