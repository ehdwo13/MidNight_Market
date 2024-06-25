var slideImgInner = document.querySelector('.slideImgInner'),
    slideImg = document.querySelectorAll('.slideImg'),
    currentIdx = 0,
    slideCount = slideImg.length,
    leftBtn = document.querySelector('.leftBtn'),
    rightBtn = document.querySelector('.rightBtn'),
    autoSlideInterval = 3000, // 자동 슬라이드 간격 (3초)
    autoSlide;

function showSlide(index) {
    slideImg.forEach(function (slide, i) {
        if (i === index) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
}

function nextSlide() {
    currentIdx = (currentIdx + 1) % slideCount;
    showSlide(currentIdx);
}

function prevSlide() {
    currentIdx = (currentIdx - 1 + slideCount) % slideCount;
    showSlide(currentIdx);
}

leftBtn.addEventListener('click', function () {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
});

rightBtn.addEventListener('click', function () {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
});

function startAutoSlide() {
    autoSlide = setInterval(nextSlide, autoSlideInterval);
}

function stopAutoSlide() {
    clearInterval(autoSlide);
}

// 초기 슬라이드 설정
showSlide(currentIdx);

// 자동 슬라이드 시작
startAutoSlide();

slideImgInner.addEventListener('mouseover', stopAutoSlide);
slideImgInner.addEventListener('mouseout', startAutoSlide);


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

