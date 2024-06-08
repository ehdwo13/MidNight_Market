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
        console.log('버튼이 클릭되었습니다.');
        const dataIndex = e.target.getAttribute('data-index');
        console.log(dataIndex);
        document.getElementById('modal-image').src = purchasedData[dataIndex].productVO.mainImage;
        document.getElementById('modal-product-name').innerText = '상품명 :    ' + purchasedData[dataIndex].productVO.name;
        document.getElementById('modal-product-description').innerText = `설명 :    ` + purchasedData[dataIndex].productVO.description;
        document.getElementById('fileList').innerHTML = '';
        productId = purchasedData[dataIndex].productId;
        ordersId = purchasedData[dataIndex].id;

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
    console.log('register-button click');
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

    // 파일 추가
    const files = document.getElementById('files').files;
    if (files.length !== 0) {
        for (let i = 0; i < files.length; i++) {
            data.append('files', files[i]);
        }
    }

    console.log(data);

    sendReviewRegisterFromServer(data).then(result => {
        if (result === 'register_success') {
            alert('리뷰를 달아주셔서 감사합니다. 100만포인트 증정해드립니다.');
            spreadMyPurchasedProductList(customerId);
        } else {
            alert('리뷰 등록 실패');
        }

        document.getElementById('cancel-button').click();
        content.value = '';
        spreadMyPurchasedProductList(customerId);
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
