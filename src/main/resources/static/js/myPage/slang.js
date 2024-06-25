
//상품찜 뿌리기 함수
async function getMySlangProductListFromServer(customerId) {

    try {
        const response = await fetch('/product/getMySlangProductList/' + customerId);
        const result = await response.json();
        return result;
    } catch (e) {
        console.log(e);
    }
}

function spreadMySlangProductList(customerId) {
    getMySlangProductListFromServer(customerId).then(result => {
        let div = document.getElementById('slangPage');
        div.innerHTML = '';
        let str = `<span style="font-weight: 600; font-size: 23px; margin-bottom:50px">전체 ${result.length}개</span> `;
        if (result.length > 0) {
            result.forEach((productVO) => {

                const price = productVO.price.toLocaleString('ko-KR') + '원';
                const discountPrice = productVO.discountPrice.toLocaleString('ko-KR') + '원';

                str += `<div class="product-box">`;
                str += `<a class="product-image-box" href="/product/detail?id=${productVO.id}">`
                str += `<img src=${productVO.mainImage} alt="ㅇㅇ" style="border-radius: 5px; width: 100%; height: 100%;">`;
                str += `</a>`;
                str += `<div class="description-box">`;
                str += `<div class="product-info">`;
                str += `<a style="font-weight: 500; font-size: 18px; color: inherit; margin-bottom: 10px; display: block;" href="/product/detail?id=${productVO.id}">${productVO.name}</a>`;
                str += `<span style="display: block;margin-bottom: 16px; font-size: 15px; font-weight: 400">${productVO.description}</span>`;
                if(productVO.discountRate === 0){
                str += `<p class="price-text">${price}</p>`;
                }else{
                    str += `<span style="color: orangered; font-weight: bold; margin-right: 5px">${productVO.discountRate}%</span>`
                    str += `<span class="price-text">${price}</span>`;
                    str += `<s style="font-size: 12px; color: gray">${price}</s>`;
                }
                str += `</div>`;
                str += `<div class="button-box">`;
                str += `<button class="delete-button select-button" onclick="deleteProduct(${productVO.id})">삭제</button>`;
                str += `<button class="order-button select-button" onclick="orderProduct(${productVO.id})">주문</button>`;
                str += `</div>`;
                str += `</div>`;
                str += `</div>`;
            });
            div.innerHTML += str;
        }else{
            div.innerHTML = `<div class="nodata-zone"><span>찜한 상품이 존재하지 않습니다.</span></div>`;
        }

    })
}

// 상품 주문 함수
function orderProduct(productId) {
    window.location.href = '/product/detail?id='+productId;
}

// 삭제하기 버튼을 눌렀을 때 상품 삭제
function deleteProduct(productId) {
    sendSlangUpdateServer(productId).then(result=>{
        if(result === 'delete_success'){
            alert('찜한 상품이 삭제되었습니다.');
            spreadMySlangProductList(customerId);
        }
    })
}

//찜한상품 정보 삭제 요청
async function sendSlangUpdateServer(productId) {
    try {
        const response = await fetch('/product/slang/' + customerId + '/' + productId, {
            method: 'DELETE',
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

