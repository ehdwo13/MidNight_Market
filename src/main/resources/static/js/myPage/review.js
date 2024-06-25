let reviewWriteData; //상품정보 저장

const reviewButtons = document.querySelectorAll('.review-select-button');

reviewButtons.forEach(button => {
    button.addEventListener('click', e => {
        // 모든 버튼의 스타일을 초기화합니다.
        reviewButtons.forEach(btn => {
            btn.style.borderBottom = '2px solid lightgray';
            btn.style.color = 'darkgray';
        });

        // 클릭된 버튼의 스타일을 변경합니다.
        const clickedButton = e.target;
        clickedButton.style.borderBottom = '2px solid red';
        clickedButton.style.color = 'orangered';

        //상품후기 작성 클릭시
        if (e.target.id === 'write-review-button') {
            spreadMyWriteReviewList(customerId);
            return;
        }

        //내가 작성한 상품 후기일 경우
        if (e.target.id === 'write-review-completed-button') {
            spreadMyWriteCompletedReviewList(customerId);
            return;
        }

        //내가적은 상품 후기일경우



    });
});


//리뷰등록 비동기
async function getMyWriteReviewListFromServer(customerId) {

    try {
        const response = await fetch('/orders/getMyWriteReviewList/' + customerId);
        const result = await response.json();
        return result;
    } catch (e) {
        console.log(e);
    }
}

function spreadMyWriteReviewList(customerId) {
    getMyWriteReviewListFromServer(customerId).then(result => {
        reviewWriteData = result;
        let div = document.getElementById('write-reviewPage');
        div.innerHTML = '';
        let str = '';
        if (result.length > 0) {
            result.forEach((value, index) => {

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
                str += `<span style="color: forestgreen; font-weight: 500">${value.status} <br><br> ${yearS}.${monthS}.${dayS} <br></span>`;
                str += `</div>`;
                str += `<div class="purchases-select-button-box">`;
                str += `<button class="review-button" data-index="${index}" data-bs-toggle="modal" data-bs-target="#staticBackdrop">후기작성</button>`;
                str += `</div>`;
                str += `</div>`;
            });
            div.innerHTML = str;
        } else {
            div.innerHTML = `<div class="nodata-zone"><span>작성가능한 후기가 존재하지 않습니다.</span></div>`;
        }
    });
}


//내가등록한 리뷰 가져오기
async function getMyWriteCompletedReviewListFromServer(customerId) {

    try {
        const response = await fetch('/review/getMyWriteCompletedReviewList/' + customerId);
        const result = await response.json();
        return result;
    } catch (e) {
        console.log(e);
    }
}

function spreadMyWriteCompletedReviewList(customerId) {
    getMyWriteCompletedReviewListFromServer(customerId).then(result => {
        reviewWriteData = result;
        let div = document.getElementById('write-reviewPage');
        div.innerHTML = '';
        let str = '';
        if (result.length > 0) {
            result.forEach((value, index) => {


                const [year, month, day, hour, minute] = value.registerDate.match(/\d+/g);
                str += `<div id="write-review-completed">`;
                str += `<div class="write-review-completed-box">`;
                str += `<div class="review-content-box">`;
                str += `<div class="review-product-info-box">`;
                str += `<div class="review-product-info-image">`;
                str += `<img src="${value.productVO.mainImage}" alt="">`;
                str += `</div>`;
                str += `<div class="review-product-info-desc">`;
                str += `<span>${value.productVO.name}</span>`;
                str += `<span>${value.productVO.description}</span>`;
                str += `</div>`;
                str += `</div>`;
                str += `<div class="star-date-box">`;
                str += `<div class="date-box"><span>${year}.${month}.${day}</span></div>`;
                str += `<div class="star-box">${starCalculate(String(value.star))}</div>`;
                str += `</div>`;
                str += `<div class="review-content">`;
                str += `<span>${value.content}</span>`;
                str += `</div>`;
                str += `</div>`;
                str += `<div class="review-image-box">`;
                if (value.reviewImageVOList.length > 0) {
                    value.reviewImageVOList.forEach((value) => {
                        str += `<img src="${value.reviewImage}" alt="">`;
                    });
                }
                str += `</div>`;
                str += `</div>`;
                str += `</div>`;

            });
            div.innerHTML = str;
        } else {
            div.innerHTML = `<div class="nodata-zone"><span>작성완료한 후기가 존재하지 않습니다.</span></div>`;
        }
    });
}


//숫자에 따라 별표시 함수
function starCalculate(starScore) {
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
            result = 'Not Star Score';
            break;
    }
    return result;
}


const rateWrap = document.querySelectorAll('.rating'),
    label = document.querySelectorAll('.rating .rating__label'),
    input = document.querySelectorAll('.rating .rating__input'),
    labelLength = label.length,
    opacityHover = '0.5';

let stars = document.querySelectorAll('.rating .star-icon');
let productId; //모달창을 열경우 모달의 상품번호 저장
let ordersId; //모달창을 열경우 모달의 주문번호 저장

checkedRate();

rateWrap.forEach(wrap => {
    wrap.addEventListener('mouseenter', () => {
        stars = wrap.querySelectorAll('.star-icon');

        stars.forEach((starIcon, idx) => {
            starIcon.addEventListener('mouseenter', () => {
                initStars();
                filledRate(idx, labelLength);

                for (let i = 0; i < stars.length; i++) {
                    if (stars[i].classList.contains('filled')) {
                        stars[i].style.opacity = opacityHover;
                    }
                }
            });

            starIcon.addEventListener('mouseleave', () => {
                starIcon.style.opacity = '1';
                checkedRate();
            });

            wrap.addEventListener('mouseleave', () => {
                starIcon.style.opacity = '1';
            });
        });
    });
});

function filledRate(index, length) {
    if (index <= length) {
        for (let i = 0; i <= index; i++) {
            stars[i].classList.add('filled');
        }
    }
}

function checkedRate() {
    let checkedRadio = document.querySelectorAll('.rating input[type="radio"]:checked');


    initStars();
    checkedRadio.forEach(radio => {
        let previousSiblings = prevAll(radio);

        for (let i = 0; i < previousSiblings.length; i++) {
            previousSiblings[i].querySelector('.star-icon').classList.add('filled');
        }

        radio.nextElementSibling.classList.add('filled');

        function prevAll() {
            let radioSiblings = [],
                prevSibling = radio.parentElement.previousElementSibling;

            while (prevSibling) {
                radioSiblings.push(prevSibling);
                prevSibling = prevSibling.previousElementSibling;
            }
            return radioSiblings;
        }
    });
}

function initStars() {
    for (let i = 0; i < stars.length; i++) {
        stars[i].classList.remove('filled');
    }
}

//모달열면 정보 바뀌게
document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('review-button')) {
        const dataIndex = e.target.getAttribute('data-index');
        document.getElementById('modal-image').src = reviewWriteData[dataIndex].productVO.mainImage;
        document.getElementById('modal-product-name').innerText = reviewWriteData[dataIndex].productVO.name;
        document.getElementById('modal-product-description').innerText = reviewWriteData[dataIndex].productVO.description;
        document.getElementById('fileList').innerHTML = '';
        productId = reviewWriteData[dataIndex].productId;
        ordersId = reviewWriteData[dataIndex].id;

    }
});

//이미지클릭하면 파일 클릭
document.getElementById('photo-upload').addEventListener('click', () => {
    document.getElementById('files').click();
});

//파일 validation, 파일 뿌려주기
document.getElementById('files').addEventListener('change', (e) => {
    const maxFiles = 3;
    const fileList = e.target.files;
    const output = document.getElementById('fileList');
    output.innerHTML = '';

    if (fileList.length > maxFiles) {
        alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다`);
        document.getElementById('files').value = '';
    } else {
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.width = '70px';
                    img.style.height = '70px';
                    img.style.marginRight = '10px';
                    img.style.borderRadius = '5px';
                    output.appendChild(img);
                };
                reader.readAsDataURL(file);
            } else {
                alert('이미지 파일만 가능합니다.');
                document.getElementById('files').value = '';
                output.innerHTML = '';
                break;
            }
        }
    }
});

//리뷰 등록 버튼 이벤트
document.getElementById('register-button').addEventListener('click', () => {
    const content = document.getElementById('content'); //리뷰 내용

    //내용 5자 미만 시
    if (content.length < 5) {
        alert('내용을 5글자 이상 입력해주세요');
        return;
    }

    //내용 200자 초과 시
    if (content.length > 200) {
        alert('내용이 200글자를 초과합니다.');
        return;
    }

    //별점 추출
    const checkedRating = document.querySelector('.rating__input:checked');
    if (checkedRating) {
        starRating = checkedRating.value; //별점수
    }

    const data = new FormData();
    data.append('content', content.value);
    data.append('star', starRating);
    data.append('customerId', customerId);
    data.append('productId', productId);
    data.append('ordersId', ordersId);
    data.append('nickName', nickName);

    // 파일 추가
    const files = document.getElementById('files').files;
    if (files.length !== 0) {
        for (let i = 0; i < files.length; i++) {
            data.append('files', files[i]);
        }
    }


    sendReviewRegisterFromServer(data).then(result => {
        const parts = result.split('/');
        let point = document.getElementById('point')
        let withoutCommaPoint = parseInt(point.innerText.replace(/,/g, ''), 10);
        point.innerText = (withoutCommaPoint + parseInt(parts[1])).toLocaleString();
        alert(parts[0]);
        spreadMyWriteReviewList(customerId);
        document.getElementById('cancel-button').click();
        content.value = '';
        //spreadMyPurchasedProductList(customerId);
    })


});

async function sendReviewRegisterFromServer(data) {

    try {
        const url = '/review/register';
        const config = {
            method: 'POST',
            body: data
        }

        const response = await fetch(url, config);
        const result = response.text();
        return result;
    } catch (e) {
        console.log(e);
    }
}
