
async function getMyFrequentPurchasesListFromServer(customerId) {

    try {
        const response = await fetch('/orders/getMyFrequentPurchasesList/' + customerId);
        const result = await response.json();
        return result;
    } catch (e) {
        console.log(e);
    }
}

function spreadMyFrequentPurchasesList(customerId) {
    getMyFrequentPurchasesListFromServer(customerId).then(result => {
        let div = document.getElementById('frequentPurchases');
        div.innerHTML = '';
        let str = '';

        if(result.length > 0){

        result.forEach((value, index)=>{
        str += `<div class="frequent-box">`;
        str += `<div class="frequent-top-box">`;
        str += `<span style="color: ${index+1 === 1 ? 'orangered' : 'black'}; font-size: ${index+1 === 1 ? '35px' : '28px'}">Top ${index+1}</span>`;
        str += `<span>${value.qty}번 구매</span>`;
        str += `</div>`;
        str += `<div class="frequent-product-box">`;
        str += `<img src="${value.productVO.mainImage}" alt="">`;
        str += `<div class="frequent-product-description-box">`;
        str += `<span>${value.productVO.name}</span>`;
        str += `<span>${value.productVO.description}</span>`;
        str += `<a href="/product/detail?id=${value.productId}"> 더 구매하러 가기 </a>`;
        str += `</div>`;
        str += `</div>`;
        str += `</div>`;
        });
        div.innerHTML += str;
        }else{
            div.innerHTML = `<div class="nodata-zone"><span>구매한 상품이 존재하지 않습니다.</span></div>`;
        }
    });
}

