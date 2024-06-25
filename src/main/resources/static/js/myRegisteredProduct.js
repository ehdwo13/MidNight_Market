//내가 등록한 상품 비동기로 리스트가져오는거 서버에 요청하기
async function getMyRegisteredProductListToFromServer(sellerId){

    try{
        const req = await fetch('/seller/getMyRegisteredProductList/'+ sellerId);
        const rsp = await req.json();
        return rsp;
    }catch (error){
        console.log(error);
    }
}


function spreadMyRegisteredProductList(sellerId){

    try {
        getMyRegisteredProductListToFromServer(sellerId).then(rsp=>{

            if(rsp.length > 0 ){
                let div = document.getElementById('spreadLine'); //뿌릴 div가져오기
                div.innerHTML = ''; //비우기
                let str = '';

                for (let li of rsp) {


                    str += `<div class="registered-list">`;
                    str += `<div class="registered-image-box">`;
                    str += `<img src="${li.mainImage}" alt="사진없음">`;
                    str += `</div>`;
                    str += `<div class="registered-info-box">`;
                    str += `<p>${li.name}</p>`;
                    str += `<p>${li.description}</p>`;
                    str += `</div>`;
                    str += `<div class="price-box update-box">`;
                    str += `<p>기존가 : ${li.price.toLocaleString()} 원</p>`;
                    if (li.discountRate !== 0) {
                        str += `<p>할인가 : ${li.discountPrice.toLocaleString()} 원</p>`;
                    }
                    str += `<button class="selectUpdate" id="price" data-productid="${li.id}" data-name="${li.name}" data-text="${li.price}">기존가 변경</button>`;
                    str += `</div>`;
                    str += `<div class="quantity-box update-box">`;
                    str += `<p>잔여수량 : ${li.totalQty} 개</p>`;
                    str += `<button class="selectUpdate" id="quantity" data-productid="${li.id}" data-name="${li.name}" data-text="${li.totalQty}">수량 추가</button>`;
                    str += `</div>`;
                    str += `<div class="discountRate-box update-box">`;
                    str += `<p>할인율 : ${li.discountRate}%</p>`;
                    str += `<button class="selectUpdate" id="discount" data-productid="${li.id}" data-name="${li.name}" data-text="${li.discountRate}">할인율 변경</button>`;
                    str += `</div>`;
                    str += `<div class="totalSoldQty-box update-box">`;
                    str += `<p>누적판매량 : ${li.totalSoldQty} 개</p>`;
                    str += `</div>`;
                    str += `</div>`;
                }
                div.innerHTML = str

                const selectButton = document.querySelectorAll('.selectUpdate');

                selectButton.forEach(button=>{

                    button.addEventListener('click',(e)=>{
                        const id = e.target.id;
                        const productId = e.target.dataset.productid;
                        const name = e.target.dataset.name;
                        const text = e.target.dataset.text;
                        openModal(productId,id,name,text);
                    });
                });
            }
        })
    }catch (error){
        console.log(error);
    }
}

document.getElementById('reload').addEventListener('click',()=>{
    spreadMyRegisteredProductList(sellerId); //뿌리기
});


let modal = document.getElementById("myModal");

// 모달 열기 (타입, 상품코드)
function openModal(productId,id,name,text) {
    let modalContent = document.getElementById("modalContent");
    // 초기화
    modalContent.innerHTML = "";
    // 타입에 따라 모달 내용 설정
    if (id === 'quantity') {
        modalContent.innerHTML = `
                    <div class="form-group">
                    <p>상품명 : ${name}</p>
                    <p>변경전 수량 : ${text} 개</p>
                        <label for="quantity">수량:</label>
                        <input type="number" id="value" name="quantity" value="1" min="1">
                    </div>
                    <div class="form-group">
                        <button onclick="myRegisteredProductUpdate(${productId}, 'quantity')">수량 추가</button>
                    </div>
                `;
    } else if (id === 'price') {
        modalContent.innerHTML = `
                    <div class="form-group">
                    <p>상품명 : ${name}</p>
                    <p>변경전 가격 : ${Number(text).toLocaleString()} 원</p>
                        <label for="price">새로운 가격:</label>
                        <input type="number" id="value" name="price" step="0.01" min="0.01">
                    </div>
                    <div class="form-group">
                        <button onclick="myRegisteredProductUpdate(${productId}, 'price')">가격 변경</button>
                    </div>
                `;
    } else if (id === 'discount') {
        modalContent.innerHTML = `
                    <div class="form-group">
                    <p>상품명 : ${name}</p>
                    <p>변경전 할인율 : ${text} %</p>
                        <label for="discount">할인율 (%):</label>
                        <input type="number" id="value" name="discount" value="0" min="0" max="100">
                    </div>
                    <div class="form-group">
                        <button onclick="myRegisteredProductUpdate(${productId}, 'discount')">할인율 변경</button>
            ${text !== '0' ? `<button onclick="myRegisteredProductUpdate(${productId}, 'discountDelete')">할인 제거</button>` : ''}
                                </div>
                `;
    }

    modal.style.display = "block";
}

// 모달 닫기
function closeModal() {
    modal.style.display = "none";
}


async function myRegisteredProductUpdate(productId,id){

    const value = document.getElementById('value').value;

    if(value < 1 && id !== 'discountDelete'){
        alert(id + '는 1보다 작을 수 없습니다. \n올바른 값으로 다시 입력해주세요.');
        return;
    }

    const data = {
        id : parseInt(productId),
        description : id,
        price : value,
        totalQty: value,
        discountRate: value
    }
    try {
        const url = '/seller/myRegisteredProductUpdate';
        const config = {
            method : 'PUT',
            headers : {
                'content-type' : 'application/json; charset = utf-8'
            },
            body : JSON.stringify(data)
        }
        const resp = await fetch(url,config);
        const result = await resp.text();

        alert(result);
        spreadMyRegisteredProductList(sellerId);
        closeModal();

    }catch(error){
        console.log(error);
    }
}


