console.log(customerId);
//상품찜 뿌리기 함수
document.addEventListener('click', (e) => {

    console.log(e.target.id);
    if (e.target.id === '3') {
        spreadMySlangProductList(customerId);
    }

});

async function getMySlangProductListFromServer(customerId) {

    try {
        const response = await fetch('/product/getMySlangProduct/' + customerId);
        const result = await response.json();
        return result;
    } catch (e) {
        console.log(e);
    }
}

function spreadMySlangProductList(customerId) {
    getMySlangProductListFromServer(customerId).then(result => {
        console.log(result);
        let div = document.getElementById('slangPage');
        div.innerHTML = '';
        let str = '';
        if (result.length > 0) {

            result.forEach(productVO => {

                str += `<div class="product-box">`;
                str += `<div class="product-image-box">`
                str += `<img src=${productVO.mainImage} alt="ㅇㅇ" style="border-radius: 5px; width: 100%; height: 100%">`;
                str += `</div>`;
                str += `<div class="product-info">`;
                str += `<h3 style="font-weight: 600; margin-bottom: 10px">${productVO.name}</h3>`;
                str += `잘되는지 확인`;
                str += `<span>${productVO.price}</span>`;
                str += `</div>`;
                str += `<button class="delete-button" onclick="deleteProduct(${productVO.id})">삭제하기</button>`;
                str += `<button class="order-button" onclick="orderProduct(${productVO.id})">주문하기</button>`;
                str += `</div>`;
            });
            div.innerHTML += str;
        }

    })
}

// 찜한 상품 목록을 화면에 표시
function displayProducts(products) {
    productList.innerHTML = '';
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product');
        productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.price}</p>
                </div>
                <button class="order-button" onclick="orderProduct(${product.id})">주문하기</button>
                <button class="delete-button" onclick="deleteProduct(${product.id})">삭제하기</button>
            `;
        productItem.addEventListener('click', () => {
            showModal(product);
        });
        productList.appendChild(productItem);
    });
}