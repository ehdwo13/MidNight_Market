// 변수 선언부
let pointText = document.getElementById('point'); //포인트
let pointInputText = document.getElementById('point-input'); //포인트 인풋
let couponDiscount = document.getElementById('couponDiscount');
let pointDiscountText = document.getElementById('pointDiscount'); //포인트할인
let finalPayText = document.getElementById('lastPay');//최종 결제 금액

const payPrice = paymentDTO.payPrice; //원래 결제금액
let usedCoupon = 0; //사용 쿠폰 금액
let usedCouponId = 0;
let usedPoint = 0; //사용 포인트 금액
let maxPoint = 0;

if(pointVal != 0){ //포인트를 소지하고 있을 경우
   maxPoint = payPrice - 100 > pointVal ? pointVal  : payPrice - 100; //소지하고있는 포인트가 결제금액보다 많을경우 결제금액이 최대 포인트가 되야한다.
}

pointText.innerText = maxPoint.toLocaleString() + '원';

//변수 선언부


document.getElementById('selectCoupon').addEventListener('click', (e) => {
    // 선택된 라디오 버튼 찾기
    const selectedCoupon = document.querySelector('input[name="coupon"]:checked');
    if (selectedCoupon) {

        const couponName = selectedCoupon.getAttribute('data-name');
        const discountAmount = Number(selectedCoupon.getAttribute('data-discount')); //사용할 쿠폰 가격
        const couponId = Number(selectedCoupon.getAttribute('data-coupon-id'));
        usedPoint = Number(pointInputText.value); //사용한 포인트 가격

        if ((payPrice - discountAmount - usedPoint) < 100) { //쿠폰을 사용하고 최종금액이 100원미만인 경우
            alert('쿠폰금액이 결제할 금액을 초과하여 사용할 수 없습니다.');
            return;
        }

        usedCoupon = discountAmount; //쿠폰사용 금액 저장
        usedCouponId = couponId;
        couponDiscount.innerText = '-' + usedCoupon.toLocaleString() + '원'; //픽시드에 쿠폰할인금액 innerText 변경
        finalPayText.innerText = (payPrice - usedCoupon - usedPoint).toLocaleString() + '원'; // 최종 결제금액 변경
        maxPoint = (payPrice - usedCoupon) > maxPoint ? maxPoint : (payPrice - usedCoupon - 100); //쿠폰을 사용했을 때 최대로 사용 할 수 있는 포인트 가격 변경
        pointText.innerText = maxPoint.toLocaleString() + '원';

        const couponSelectionDiv = document.getElementById('couponSelection');
        couponSelectionDiv.innerHTML = `<span style="font-size: 18px; font-weight: 400; width: auto">선택된 쿠폰 : ${couponName}</span><br><span style="font-size: 18px; font-weight: 400; width: auto">할인 가격: ${discountAmount}원</span>`;
        couponSelectionDiv.style.display = 'block';
        couponModal.style.display = "none";
    } else {
        alert('쿠폰을 선택하세요.');
    }
});


document.getElementById('point-input').addEventListener('input', (e) => { //포인트를 변경할 경우 이벤트

    const inputVal = Number(pointInputText.value); //현재 포인트 입력한 금액

    if (inputVal < 0) { //입력한 포인트가 음수라면 안되게
        usedPoint = 0; //포인트 사용값 0으로 변경
        pointInputText.value = 0; //인풋밸류값 변경
        pointText.innerText = maxPoint.toLocaleString() + '원'; //포인트 사용값 최대 포인트로 변경
        pointDiscountText.innerText = 0 + '원'; //포인트 할인금액 0으로 변경
        finalPayText.innerText = (payPrice - usedCoupon - usedPoint).toLocaleString() + '원'; //최종결제금액 변경
        return;
    }
    if (inputVal > maxPoint) { //최대로 사용할 수 있는 포인트를 넘는다면
        usedPoint = maxPoint; //사용한포인트는 최대 포인트로 변경
        pointInputText.value = maxPoint; //인풋 밸류값 최대값으로 변경
        pointText.innerText = '0원' //최대로 사용했기 떄문에 사용할 수있는 금액 0원으로 변경
        pointDiscountText.innerText = '-' + maxPoint.toLocaleString() + '원'; //포인트 할인금액 최대값으로 변경
        finalPayText.innerText = (payPrice - usedCoupon - usedPoint).toLocaleString() + '원'; //최종 결제금액 변경
        return;
    }

    usedPoint = inputVal; //사용한 포인트값 변경
    pointText.innerText = (maxPoint - inputVal).toLocaleString() + '원'; //사용한금액 차감하고 표시
    pointDiscountText.innerText = '-' + inputVal.toLocaleString() + '원'; //포인트 할인금액 변경
    finalPayText.innerText = (payPrice - usedCoupon - usedPoint).toLocaleString() + '원'; //최종 결제금액 변경

})

//포인트 모두 사용 버튼 클릭 시
document.getElementById('all-in').addEventListener('click', () => {

    if (maxPoint === Number(pointInputText.value)) {
        alert('사용할 수 있는 포인트가 최대입니다.');
        return;
    }

    usedPoint = maxPoint; //사용한포인트는 최대 포인트로 변경
    pointInputText.value = maxPoint; //인풋 밸류값 최대값으로 변경
    pointText.innerText = '0원' //최대로 사용했기 떄문에 사용할 수있는 금액 0원으로 변경
    pointDiscountText.innerText = '-' + maxPoint.toLocaleString() + '원'; //포인트 할인금액 최대값으로 변경
    finalPayText.innerText = (payPrice - usedCoupon - usedPoint).toLocaleString() + '원'; //최종 결제금액 변경
});

var couponModal = document.getElementById("couponModal");
var btn = document.getElementById("couponSelect");
var span = document.getElementsByClassName("closeModal")[0];
btn.onclick = function () {
    couponModal.style.display = "flex";
}
span.onclick = function () {
    couponModal.style.display = "none";
}
couponModal.onclick = function (event) {
    if (event.target == couponModal) {
        couponModal.style.display = "none";
    }
}

window.onload = function () {
    function onClick() {
        document.querySelector('.modal_wrap1').style.display = 'block';
        document.querySelector('.black_bg1').style.display = 'block';
    }

    function offClick() {
        document.querySelector('.modal_wrap1').style.display = 'none';
        document.querySelector('.black_bg1').style.display = 'none';
    }

    document.getElementById('modal_btn1').addEventListener('click', onClick);

    document.querySelector('.modal_close1').addEventListener('click', offClick);

}

// Modal을 가져옵니다.
var modals = document.getElementsByClassName("modal");
// Modal을 띄우는 클래스 이름을 가져옵니다.
var btns = document.getElementsByClassName("btn");
// Modal을 닫는 close 클래스를 가져옵니다.
var spanes = document.getElementsByClassName("close");
var funcs = [];

// Modal을 띄우고 닫는 클릭 이벤트를 정의한 함수
function Modal(num) {
    return function () {
        // 해당 클래스의 내용을 클릭하면 Modal을 띄웁니다.
        btns[num].onclick = function () {
            modals[num].style.display = "block";
        };

        // <span> 태그(X 버튼)를 클릭하면 Modal이 닫습니다.
        spanes[num].onclick = function () {
            modals[num].style.display = "none";
        };
    };
}

// 원하는 Modal 수만큼 Modal 함수를 호출해서 funcs 함수에 정의합니다.
for (var i = 0; i < btns.length; i++) {
    funcs[i] = Modal(i);
}

// 원하는 Modal 수만큼 funcs 함수를 호출합니다.
for (var j = 0; j < btns.length; j++) {
    funcs[j]();
}

// Modal 영역 밖을 클릭하면 Modal을 닫습니다.
window.onclick = function (event) {
    if (event.target.className == "modal") {
        event.target.style.display = "none";
    }
};


//쉼표와 원을 붙여주는 함수
function formatCurrency(number) {
    return number.toLocaleString() + " 원";
}

// 쉼표와 '원' 제거하고 숫자로 형변환 리턴 함수
function cleanCurrencyString(currencyString) {
    return Number(currencyString.replace(/,/g, '').replace(/원/g, ''));
}


