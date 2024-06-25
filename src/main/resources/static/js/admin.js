document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('couponPublish').click();
});
document.body.addEventListener('click',(e)=>{
    let target = e.target;
    let html = document.getElementById('contentDisplay');
    let str = '';
    if(target.id === "couponPublish"){
        str += `쿠폰 이름 입력<input type="text" id="name" name="name"><br>`;
        str += `할인 금액 설정<input type="number" id="discountAmount" name="discountAmount"><br>`
        str += `유효기간 설정<input type="date" id="endDate" name="endDate"><br>`;
        str += `<button id="couponMake">발급하기</button>`
        html.innerHTML = str;
        document.getElementById('couponMake').addEventListener('click',()=>{
            makeCoupon().then(result =>{
                if(result === "ok"){
                    alert("쿠폰발급완료");
                    window.location.reload();
                }else{
                    alert("에러발생");
                }
            })
        })
    }else if(target.id === "couponList"){
        html.innerHTML = '';
        getCouponList().then(result =>{
            str += '<table>';
            str += '<thead>';
            str += '<tr>';
            str += '<th>번호</th>';
            str += '<th>쿠폰 이름</th>';
            str += '<th>할인 설정 금액</th>';
            str += '<th>등록일</th>';
            str += '<th>만료일</th>';
            str += '</tr>';
            str += '</thead>';
            str += '<tbody>';
            result.forEach(coupon => {
                str += '<tr>';
                str += `<td>${coupon.id}</td>`;
                str += `<td>${coupon.name}</td>`;
                str += `<td>${coupon.discountAmount}</td>`;
                str += `<td>${coupon.issueDate}</td>`;
                str += `<td>${coupon.endDate}</td>`;
                str += '</tr>';
            });
            str += '</tbody>';
            str += '</table>';
            html.innerHTML = str;
        })
    }else if(target.id === "inquiry"){
        getHelpList().then(result =>{
            str += '<table>';
            str += '<thead>';
            str += '<tr>';
            str += '<th>번호</th>';
            str += '<th>작성자</th>';
            str += '<th>제목</th>';
            str += '<th>내용</th>';
            str += '<th>등록일</th>';
            str += '</tr>';
            str += '</thead>';
            str += '<tbody>';
            result.forEach(help => {
                str += '<tr>';
                str += `<td>${help.hno}</td>`;
                str += `<td><a href="/help/detail?hno=${help.hno}" style="text-decoration: none; color: black">${help.id}</a></td>`;
                str += `<td>${help.title}</td>`;
                str += `<td>${help.content}</td>`;
                str += `<td>${help.regAt}</td>`;
                str += '</tr>';
            });
            str += '</tbody>';
            str += '</table>';
            html.innerHTML = str;
        })
    }else if(target.id === "orders"){
        getOrderList().then(result =>{
            str += '<table>';
            str += '<thead>';
            str += '<tr>';
            str += '<th>고객아이디</th>';
            str += '<th>상품아이디</th>';
            str += '<th>수량</th>';
            str += '<th>가격</th>';
            str += '<th>주문날짜</th>';
            str += '<th>상태</th>';
            str += '</tr>';
            str += '</thead>';
            str += '<tbody>';
            result.forEach(orders => {
                str += '<tr>';
                str += `<td>${orders.customerId}</td>`;
                str += `<td><a href="/product/detail?id=${orders.productId}" style="text-decoration: none; color: black">${orders.productId}</a></td>`;
                str += `<td>${orders.qty}</td>`;
                str += `<td>${orders.payPrice}</td>`;
                str += `<td>${orders.ordersDate}</td>`;
                str += `<td>${orders.status}</td>`;
                str += '</tr>';
            });
            str += '</tbody>';
            str += '</table>';
            html.innerHTML = str;
        })
    }else if(target.id === "sellerList"){
        getSellerList().then(result =>{
            str += '<table>';
            str += '<thead>';
            str += '<tr>';
            str += '<th>마켓이름</th>';
            str += '<th>판매자아이디</th>';
            str += '<th>연락처</th>';
            str += '</tr>';
            str += '</thead>';
            str += '<tbody>';
            result.forEach(seller => {
                str += '<tr>';
                str += `<td><a href="/seller/myRegisteredProduct?id=${seller.id}" style="text-decoration: none; color: black">${seller.shopName}</a></td>`;
                str += `<td>${seller.id}</td>`;
                str += `<td>${seller.tel}</td>`;
                str += '</tr>';
            });
            str += '</tbody>';
            str += '</table>';
            html.innerHTML = str;
        })
    }else if(target.id === "memberList"){
        getCustomerList().then(result =>{
            str += '<table>';
            str += '<thead>';
            str += '<tr>';
            str += '<th>아이디</th>';
            str += '<th>닉네임</th>';
            str += '<th>가입방법</th>';
            str += '<th>가입날짜</th>';
            str += '<th>멤버쉽가입여부</th>';
            str += '<th>포인트</th>';
            str += '</tr>';
            str += '</thead>';
            str += '<tbody>';
            result.forEach(customer => {
                str += '<tr>';
                str += `<td>${customer.id}</a></td>`;
                str += `<td>${customer.nickName}</td>`;
                str += `<td>${customer.provider}</td>`;
                str += `<td>${customer.registerDate}</td>`;
                str += `<td>${customer.mstatus ? 'O' : 'X'}</td>`;
                str += `<td>${customer.point}</td>`;
                str += '</tr>';
            });
            str += '</tbody>';
            str += '</table>';
            html.innerHTML = str;
        })
    }
})
async function makeCoupon() {
    const data = {
        name: document.getElementById('name').value,
        discountAmount: document.getElementById('discountAmount').value,
        endDate: document.getElementById('endDate').value
    };
    try {
        const url = '/admin/makeCoupon';
        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(data)
        };
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (error) {
        console.log(error);
    }
}
async function getCouponList(){
    try {
        const resp = await fetch("/admin/getList");
        const result = await resp.json();
        return result;
    }catch (error){
        console.log(error);
    }
}
async function getHelpList(){
    try {
        const resp = await fetch("/help/getList");
        const result = await resp.json();
        return result;
    }catch (error){
        console.log(error);
    }
}
async function getOrderList(){
    try {
        const resp = await fetch("/orders/getList");
        const result = await resp.json();
        return result;
    }catch (error){
        console.log(error);
    }
}
async function getSellerList(){
    try {
        const resp = await fetch("/seller/getList");
        const result = await resp.json();
        return result;
    }catch (error){
        console.log(error);
    }
}
async function getCustomerList(){
    try {
        const resp = await fetch("/customer/getList");
        const result = await resp.json();
        return result;
    }catch (error){
        console.log(error);
    }
}