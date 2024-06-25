//리뷰카운트 업데이트
document.getElementById('reviewCounter').innerText = rvo.length != 0 ? ' +' + rvo.length : '';

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
            (Number(productDTO.productVO.discountPrice) * Number(productQty.innerText))
                .toLocaleString('ko-KR') + ' 원';
    }

    //수량 감소 버튼
    if (e.target.id == '-') {
        productQty.innerText = Number(productQty.innerText) - 1; //수량 -1
        productPrice.innerText =
            (Number(productDTO.productVO.discountPrice) * Number(productQty.innerText))
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
    if(sellerCheck){
        alert("판매자는 구입불가합니다.\n일반고객으로 로그인해주세요")
    }else{
        if(isAuthenticated){
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
        }else{
            if(confirm("로그인이 필요한 서비스입니다. 로그인페이지로 이동하시겠습니까? ")){
                let returnUrl = encodeURI(window.location.href);
                window.location.href = "/login/form?returnUrl="+returnUrl;
                setCookie("url", returnUrl);
            }
        }

    }


});

//찜하기 코드
document.getElementById('slangBtn').addEventListener('click', (e) => {
    const targetButton = e.target.closest('.like-button'); // 클릭된 요소가 like-button 클래스를 가진 버튼인지 확인
    if (targetButton) {
        //로그인을 안했을 시
        if(sellerCheck){
            alert("판매자는 찜불가합니다.\n일반고객으로 로그인해주세요")
        }else {
            if (isAuthenticated) {
                if (targetButton.dataset.type === 'post') {
                    slangInfoChange(customerId, productId, 'POST');
                }
                if (targetButton.dataset.type === 'delete') {
                    slangInfoChange(customerId, productId, 'DELETE');
                }
            }else{
                if(confirm("로그인이 필요한 서비스입니다. 로그인페이지로 이동하시겠습니까? ")){
                    let returnUrl = encodeURI(window.location.href);
                    window.location.href = "/login/form?returnUrl="+returnUrl;
                    setCookie("url", returnUrl);
                }
            }
        }
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

        let div = document.querySelector('.like-button');
        div.dataset.type = ''; // 데이터셋 속성 초기화
        let str = '';

        if (result == 'delete_success') {
            alert('찜하기 삭제 완료!`');
            str += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" class="bi bi-suit-heart" viewBox="0 0 16 16">`;
            str += `<path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>`;
            str += `</svg>`;
            div.dataset.type = 'post';
        }

        if (result == 'post_success') {
            alert('찜하기 완료!');
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
    if(sellerCheck){
        alert("판매자는 구입불가합니다.\n일반고객으로 로그인해주세요")
    }else{
        if(isAuthenticated){
            const targetButton = e.target.closest('#orderButton'); // 클릭된 요소가 like-button 클래스를 가진 버튼인지 확인
            if(targetButton){

                const merchant_uid = 'merchant_uid' + new Date().getTime();
                //필요한 정보 : 고객 아이디, 상품아이디, 수량
                const payData = {
                    merchantUid: merchant_uid,
                    customerId: customerId,
                    productId : productId,
                    qty : parseInt(productQty.innerText)
                };

                postPaymentToServer(payData).then(result=>{

                    const message = result.replace(/\d+$/, '');
                    const number = result.replace(/\D/g, '');

                    //잔여수량 보다 주문수량이 많을 시
                    if(message === 'excess_quantity'){

                        productQty.innerText = number;

                        if(confirm(`${productDTO.productVO.name} 상품은 잔여수량이 ${number}개 남았습니다. \n${number}개로 주문하시겠습니까??`)){
                            postPaymentToServer(payData);
                        }
                        document.getElementById('+').disabled = true;
                    }

                    //재고 없을 시
                    if(message === 'quantity_exhaustion'){
                        alert(productDTO.productVO.name + ' 상품은 품절되었습니다.');
                    }

                    //DB저장에 성공했을 시
                    if(result === 'success'){
                        alert('주문서 페이지로 이동합니다.');
                        //form데이터 merchantUid를 order페이지에 보낸다
                        document.getElementById('merchantUid').value = merchant_uid;
                        document.getElementById('orderMoveForm').submit();

                    }

                });
            }
        }else{
            if(confirm("로그인이 필요한 서비스입니다. 로그인페이지로 이동하시겠습니까? ")){
                let returnUrl = encodeURI(window.location.href);
                window.location.href = "/login/form?returnUrl="+returnUrl;
                setCookie("url", returnUrl);
            }

        }
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

// 리뷰 도움돼요 버튼
document.addEventListener('DOMContentLoaded', () => {
    const detailReviewBox = document.querySelector('.detailReviewBox');

    // 이벤트 위임을 통해 likeBtn 버튼 처리
    detailReviewBox.addEventListener('click', (e) => {

            if (e.target.matches('#sortedByRecommendation')) {
                sortReviewsList('recommendation');
                return;
            } else if (e.target.matches('#sortedByNewest')) {
                sortReviewsList('newest');
                return;
            }

        if (e.target && e.target.matches('.likeBtn')) {

            if (customerId == null) {
                alert("로그인 후 클릭 가능합니다.");
                return;
            }

            const button = e.target;
            const id = customerId; // customerId가 어디서 온 변수인지 확인 필요

            let dataType = button.dataset.type;
            let reviewId = button.dataset.reviewid;
            const index = button.dataset.index;
            // console.log(index);
            const data = {
                customerId: id,
                reviewId: reviewId
            };
            //변경해야할 목록
            //data-type, img, revCount,
            isExist(data).then(result => {
                if (result.includes("있음")) {
                    rvo[index].reviewLikeVO = null;
                    dataType = "delete"; //있으면 삭제로 바꿔줌
                    button.dataset.type = dataType;
                    let img = document.getElementById('likeIcon' + data.reviewId);
                    img.src = '/dist/icon/good.png'; // 버튼 취소했을 때
                    reviewLikeUpdateFromServer(dataType, data).then(result => {
                        let str = result;
                        let count = str.substring(str.search("/") + 1, str.length);
                        document.getElementById('count' + reviewId).innerText = count;
                    });
                } else if (result.includes("없음")) {
                    rvo[index].reviewLikeVO =
                    {
                    reviewId : reviewId,
                    customerId : customerId
                    };
                    dataType = "post";
                    button.dataset.type = dataType;
                    let img = document.getElementById('likeIcon' + data.reviewId)
                    img.src = '/dist/icon/good-fill.png'; // 버튼 눌렀을 때
                    reviewLikeUpdateFromServer(dataType, data).then(result => {
                        let str = result;
                        let count = str.substring(str.search("/") + 1, str.length);
                        document.getElementById('count' + reviewId).innerText = count;
                    });
                }
                // console.log(rvo);
            });
        }
    });


    // 리뷰 추천순, 최신순 정렬 함수
    function sortReviewsList(sortType) {
        // console.log(sortType);
        if (sortType === 'recommendation') { //추천순 정렬
            rvo.sort((a, b) => b.revUpCount - a.revUpCount);
        }
        if (sortType === 'newest') { //최신순 정렬
            rvo.sort((a, b) => new Date(b.registerDate) - new Date(a.registerDate));
        }
        spreadReviewList();
    }

    function spreadReviewList() {
        const reviews = detailReviewBox.querySelectorAll('.review');
        reviews.forEach(review => review.remove()); //review Class 삭제

        let str = '';
        rvo.forEach((value, index) => {
            let arrayObj = [value];

            str += `<div class="review">`;
            str += `<div class="left-side">`;
            str += `<p>${value.nickName}</p>`;
            str += `</div>`;
            str += `<div class="right-side">`;
            str += `<span class="star">${starCalculate(arrayObj)}</span>`;
//            str += `</div>`;
            str += `<p class="productName">${productDTO.productVO.name}</p>`;
            str += `<p class="reviewContent">${value.content}</p>`;
            str += `<div class="reviewImgDatail">`;

            value.reviewImageVOList.forEach((reviewImg) => {
                let fixedReviewImage = reviewImg.reviewImage.replace(/\\/g, '/');
                str += `<img src="${reviewImg.reviewImage}" onclick="openModal('${fixedReviewImage}')">`;
            });

            str += `</div>`;
            str += `<div id="myModal" class="modal" onclick="closeModal()">`;
            str += `<span class="close">&times;</span>`;
            str += `<img class="modal-content" id="modalImg" style="width: 80%; height: 90%;">`;
            str += `</div>`;
            str += `<div class="date">${value.registerDate}`;
            str += `<button type="button" class="likeBtn" `;
            str += `data-type=${value.reviewLikeVO == null ? 'post' : 'delete'} data-reviewid=${value.id} data-index=${index}>`;
            str += `<img src=${value.reviewLikeVO == null ? '/dist/icon/good.png' : '/dist/icon/good-fill.png'} style="width: 26px; height: 26px;" id="likeIcon${value.id}">도움돼요`;
            str += `<p class="count" id="count${value.id}">${value.revUpCount}</p>`;
            str += `<p id="reviewId" style="display: none">${value.id}</p>`;
            str += `</button>`;
            str += `</div>`;
            str += `</div>`;
            str += `</div>`;
        });

        detailReviewBox.innerHTML += str;
    }

    async function isExist(data) {
        try {
            const url = "/product/isExist";
            const config = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(data)
            };
            const resp = await fetch(url, config);
            const result = await resp.text();
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    async function reviewLikeUpdateFromServer(type, data) {
        try {
            const url = "/product/reviewLikeRegister";
            const config = {
                method: type,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };
            const resp = await fetch(url, config);
            const result = await resp.text();
            return result;
        } catch (e) {
            console.log(e);
        }
    }
});


// async function reviewCountFromServer(reviewId){
//     try{
//         const url = "/product/getCount/"+reviewId;
//         const config = {
//             method : 'get'
//         }
//         const resp = await fetch(url, config);
//         const result = await resp.text()
//         return result;
//     }catch (e){
//         console.log(e);
//     }
// }

// // 리뷰 도움돼요 버튼
// const likeBtn = document.querySelectorAll('.likeBtn');
//
// likeBtn.forEach(button =>{
//     let countValue = 0;
//     let status = false; //현재 도움돼요 버튼 증가 여부
//     let likeCount = button.querySelector('.count');
//
//     button.addEventListener('click', ()=>{
//
//         if(customerId == null){
//             alert("로그인 후 클릭 가능합니다.");
//         }else{
//            if(status){
//                countValue--;
//            } else {
//              countValue++;
//            }
//             likeCount.innerText = countValue;
//            status = !status; //현재 상태에서 반전시키기
//         }
//     });
// });

// 디테일 메뉴바 스크롤 적용
document.getElementById('product-detail').addEventListener('click', () => {
    let productDetail = document.querySelector('.product-detail');
    let productDetailOffset = productDetail.offsetTop-70; //너무 내려가서 -70처리해서 위치조절함
    scroll(productDetailOffset);
});
document.getElementById('product-review').addEventListener('click', () => {
    let productReview = document.querySelector('.product-review');
    let productReviewOffset = productReview.offsetTop-70;
    scroll(productReviewOffset);
});
document.getElementById('product_qna').addEventListener('click', () => {
    let productQna = document.querySelector('.product-qna');
    let productQnaOffset = productQna.offsetTop-70;
    scroll(productQnaOffset);
});
document.getElementById('product-info').addEventListener('click', () => {
    let productInfo = document.querySelector('.productDetailInfo');
    let productInfoOffset = productInfo.offsetTop-70;
    scroll(productInfoOffset);
});

// 스크롤 function
function scroll(offset) {
    window.scrollTo({
        top: offset,
        behavior: 'smooth'
    });
}

// 리뷰 이미지 클릭하면 모달띄우기
function openModal(imageLink) {
    let modal = document.getElementById('myModal'); // 모달창
    let modalImg = document.getElementById('modalImg'); // 모달안 이미지

    modal.style.display = 'block';
    modalImg.src = imageLink; // 이미지 경로
}

    function closeModal() {
        let modal = document.getElementById('myModal');
        modal.style.display = 'none';
    }


// 댓글 보이기
function btnClick() {
        const mydiv = document.getElementById('my-div');

        if(mydiv.style.display == 'block') {
          mydiv.style.display = 'none';
        }else {
          mydiv.style.display = 'block';
        }
}


document.getElementById('starAverage').innerHTML = starCalculate(rvo); //함수로 별점 관리

//별점 평균 구해서 뿌리는 function


//숫자에 따라 별표시 함수
function starCalculate(rvoList) {

let starScore = 0; //점수 넣을 변수

rvoList.forEach((value,index) =>{ //reviewVOList에 있는 별점 합산
starScore += value.star;
});

starScore = starScore / rvoList.length;
starScore = customRound(starScore); //5이상이면 반올림 4이하이면 반내림
starScore = String(starScore); //스트링형으로 만들어서 형변환 해줌

    let result;

    switch (starScore) {
        case '5':
            result = `
            <img src="/dist/icon/star-half.svg" alt="Half Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
        `;
            break;
        case '10':
            result = `
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
        `;
            break;
        case '15':
            result = `
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-half.svg" alt="Half Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
        `;
            break;
        case '20':
            result = `
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
        `;
            break;
        case '25':
            result = `
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-half.svg" alt="Half Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
        `;
            break;
        case '30':
            result = `
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
        `;
            break;
        case '35':
            result = `
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-half.svg" alt="Half Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
        `;
            break;
        case '40':
            result = `
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star.svg" alt="Empty Star">
        `;
            break;
        case '45':
            result = `
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-half.svg" alt="Half Star">
        `;
            break;
        case '50':
            result = `
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
            <img src="/dist/icon/star-fill.svg" alt="Filled Star">
        `;
            break;
        default:
            result = `
            <img src="/dist/icon/star-gray.svg" alt="Empty Star">
            <img src="/dist/icon/star-gray.svg" alt="Empty Star">
            <img src="/dist/icon/star-gray.svg" alt="Empty Star">
            <img src="/dist/icon/star-gray.svg" alt="Empty Star">
            <img src="/dist/icon/star-gray.svg" alt="Empty Star">
        `;
            break;
    }
    return result;
}

function customRound(num) {
  // 나머지를 구함
  const remainder = num % 5;

  // 나머지가 5 이상이면 반올림, 그렇지 않으면 반내림
  if (remainder >= 2.5) {
    return Math.ceil(num / 5) * 5;
  } else {
    return Math.floor(num / 5) * 5;
  }
}



//멤버십결제 페이지 이동
document.getElementById('membershipPayment').addEventListener('click', (e) => {

    e.preventDefault();

    if (customerId == null) {
        alert('로그인을 해주세요.');
        return;
    }


    const merchantUid = 'merchant_uid' + new Date().getTime();//결제 고유Id

    saveMembershipPaymentInfo(customerId, merchantUid).then(rsp => {

        if (rsp === 'fail') { //사전검증 데이터 등록 안되었을 경우
            alert('오류가 발생했습니다.\n잠시후 다시 시도해주세요.');
            return;
        }


        localStorage.setItem('merchantUid', merchantUid); //스토리지에 저장하여 숨겨서 이동

        const popupWidth = 910;
        const popupHeight = 700;
        const leftPosition = (screen.width - popupWidth) / 2;
        const topPosition = (screen.height - popupHeight) / 2 - 50; // 살짝 위에 위치하도록 조정
        const url = '/payment/memberShipPaymentPopup';
        const popupFeatures = 'width=' + popupWidth + ',height=' + popupHeight + ',left=' + leftPosition + ',top=' + topPosition;

        window.open(url, '_blank', popupFeatures);
    });

});

//사전검증을 위해 미리 결제 데이터 저장하기
async function saveMembershipPaymentInfo(customerId, merchantUid) {

    const data = {
        merchantUid: merchantUid,
        customerId: customerId
    }


    try {
        const url = '/payment/saveMembershipPaymentInfo';
        const config = {
            method: 'POST',
            headers: {
                'content-type': 'application/json; charset =utf-8'
            },
            body: JSON.stringify(data)
        }
        const req = await fetch(url, config);
        const rsp = await req.text();
        return rsp;
    } catch (error) {
        console.log(error);
    }

}




