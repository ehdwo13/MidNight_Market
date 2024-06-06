var slideImgInner = document.querySelector('.slideImgInner'),
    slideImg = document.querySelectorAll('.slideImg'),
    currentIdx = 0,
    slideCount = slideImg.length,
    leftBtn = document.querySelector('.leftBtn'),
    rightBtn = document.querySelector('.rightBtn'),
    autoSlideInterval = 2500, // 자동 슬라이드 간격 (2.5초)
    autoSlide;

function showSlide(index) {
    slideImg.forEach(function(slide, i) {
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

leftBtn.addEventListener('click', function() {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
});

rightBtn.addEventListener('click', function() {
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
