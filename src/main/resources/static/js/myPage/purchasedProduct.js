//상품 정보 저장 하기
let purchasedData;

async function getMyPurchasedProductListFromServer(customerId) {

    try {
        const response = await fetch('/orders/getMyPurchasedProductList/' + customerId);
        const result = await response.json();
        return result;
    } catch (e) {
        console.log(e);
    }
}

function spreadMyPurchasedProductList(customerId) {
    getMyPurchasedProductListFromServer(customerId).then(result => {
        let div = document.getElementById('purchasedPage');
        div.innerHTML = '';
        let str = '';
        if (result.length > 0) {
            result.forEach((value) => {

                const [year, month, day, hour, minute] = value.ordersDate.match(/\d+/g);
                const [yearS, monthS, dayS, hourS, minuteS] = value.statusDate.match(/\d+/g);

                str += `<div class="purchased-date-box">`;
                str += `<span>${year}.${month}.${day} (${hour}시 ${minute}분)</span>`;
                str += `</div>`;
                str += `<div class="purchased-box">`;
                str += `<div class="purchased-image-box">`;
                str += `<img src="${value.productVO.mainImage}" alt="사진없음">`;
                str += `</div>`;
                str += `<div class="purchased-product-info-box">`;
                str += `<p>${value.productVO.name}</p>`;
                str += `<span class="purchased-price">${value.payPrice.toLocaleString()}원</span>`;
                str += `<span class="purchased-quantity">${value.qty}개 구매</span>`;
                str += `</div>`;
                str += `<div class="purchased-status">`;
                str += `<span style="color: ${displayColorByStatus(value.status)}; text-align: center">${value.status} ${value.confirmed ? '<br>(주문확정)<br>' : ''} <br><br> ${yearS}.${monthS}.${dayS} <br> (${hourS}시 ${minuteS}분)</span>`;
                str += `</div>`;
                str += `<div class="purchases-select-button-box">`;

                if (value.status === '주문완료' && !value.confirmed) {
                    str += `<button class="orderConfirmed-button" data-id="${value.id}" data-name="${value.productVO.name}" data-price="${value.payPrice}">주문확정</button>`;
                    str += `<button class="refundButton" data-id="${value.id}" data-name="${value.productVO.name}" data-price="${value.payPrice}">환불하기</button>`;
                }

                if(value.status === '배송완료' && !value.confirmed){//배송완료되었지만 주문확정을 하지 않았을 경우
                    str += `<button class="orderConfirmed-button" data-id="${value.id}" data-name="${value.productVO.name}" data-price="${value.payPrice}">주문확정</button>`;
                    str += `<button class="refundButton" data-id="${value.id}" data-name="${value.productVO.name}" data-price="${value.payPrice}">환불하기</button>`;
                }

                if(value.status === '배송완료' && !value.reviewComment && value.confirmed){ //배송완료지만 주문확정을 했을 경우
                    str += `<button class="review-gogo">리뷰작성</button>`;
                }

                str += `</div>`;
                str += `</div>`;
            });
            div.innerHTML = str;

            //환불버튼 클릭시
            const refundButtons = document.querySelectorAll('.refundButton');
            refundButtons.forEach(button => {
                button.addEventListener('click', (e) => {

                    const price = Number(e.target.dataset.price).toLocaleString();
                    const name = e.target.dataset.name;
                    const id = e.target.dataset.id;

                    const notification = '상품명 : '+ name + '\n가격 : ' + price +'원\n\n정말로 환불을 진행하시겠습니까?';

                    if (!confirm(notification)) {
                        e.preventDefault();
                        return;
                    }

                    // POST 요청 보내기
                    fetch('/payment/refund', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({id: id})
                    })
                        .then(response => response.text())
                        .then(data => {
                            // 서버 응답 처리
                            alert(data);
                            let point = document.getElementById('point')
                            const refundPoint = Number(data.match(/환급된 포인트\s*:\s*([\d,]+)원/)[1].replace(/,/g, ''));
                            let withoutCommaPoint = parseInt(point.innerText.replace(/,/g, ''), 10);
                            point.innerText = (withoutCommaPoint + refundPoint).toLocaleString();
                            spreadMyPurchasedProductList(customerId);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                });
            });

            //주문확정 클릭시
            const orderConfirmedButton = document.querySelectorAll('.orderConfirmed-button');

            orderConfirmedButton.forEach((button)=>{

                button.addEventListener('click',(e)=>{

                    const id = e.target.dataset.id;
                    const price = Number(e.target.dataset.price).toLocaleString();
                    const name = e.target.dataset.name;
                    let point = document.getElementById('point')

                    const notification = '상품명 : '+ name + '\n가격 : ' + price +'원\n\n주문확정을 하실 경우 환불이 불가능합니다.\n정말로 주문확정을 진행하시겠습니까?';
                    if(!confirm(notification)){
                        e.preventDefault();
                        return;
                    }

                    confirmOrderUpdate(id).then(result=>{
                        const parts = result.split('/');
                        alert(parts[0]);
                        let withoutCommaPoint = parseInt(point.innerText.replace(/,/g, ''), 10);
                        point.innerText = (withoutCommaPoint + parseInt(parts[1])).toLocaleString();
                        spreadMyPurchasedProductList(customerId);
                    });
                });
            });
            
            //리뷰작성 클릭 시
            const reviewGo = document.querySelectorAll('.review-gogo');
            reviewGo.forEach((button)=>{
                button.addEventListener('click',()=>{
                    const myPageSelect = document.querySelectorAll('.mypage_text8');
                    myPageSelect[4].click();
                });
            });

        } else {
            div.innerHTML = `<div class="nodata-zone"><span>주문 내역이 존재하지 않습니다.</span></div>`;
        }
    });
}


function displayColorByStatus(status) {

    let color;

    switch (status) {
        case '배송완료' :
            color = 'forestgreen';
            break;

        case '환불처리' :
            color = 'red';
            break;

        default :
            color = 'black';
            break;
    }
    return color;
}



//주문확정시 업데이트
async function confirmOrderUpdate(id) {
    const url = '/orders/confirmOrderUpdate';
    const config = {
        method: 'PUT',
        headers: {
            'content-type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            id: id
        })
    };

    const response = await fetch(url, config);
    const result = await response.text();
    return result;
}

