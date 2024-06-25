function updateCategoryOptions() {
    let categorySelect = document.getElementById("categorySelect");
    let categoryDetailSelect = document.getElementById("categoryDetailSelect");

    // 기존 옵션들을 모두 제거합니다
    categoryDetailSelect.innerHTML = "";

    for (let i = 0; i < productDTO.pcdList.length; i++) {

        if (productDTO.pcdList[i].productCategoryId == categorySelect.value) {
            let option = document.createElement('option');
            option.text = productDTO.pcdList[i].name;
            option.value = productDTO.pcdList[i].id;
            categoryDetailSelect.add(option);
        }
    }
}


document.getElementById('product-name-input').addEventListener('input', (e) => {
    const nameLength = e.target.value.length;
    const nameError = document.getElementById('product-name-error');
    if (nameLength < 2) {
        nameError.innerText = '상품명을 2글자 이상 입력해주세요.';
    } else {
        nameError.innerText = '';
    }

    if (nameLength > 45) {
        e.target.value = e.target.value.slice(0, 45);
        return;
    }


    document.getElementById('product-name-length').innerText = nameLength;

});


document.getElementById('product-description-input').addEventListener('input', (e) => {
    const descLength = e.target.value.length;
    const descError = document.getElementById('product-desc-error');
    if (descLength < 5) {
        descError.innerText = '상품설명을 5글자 이상 입력해주세요.';
    } else {
        descError.innerText = '';
    }
    if (descLength > 45) {
        e.target.value = e.target.value.slice(0, 45);
        return;
    }
    document.getElementById('product-description-length').innerText = descLength;
});


//가격입력
document.getElementById('price').addEventListener('input', (e) => {

    document.getElementById('product-price-error').innerText = '';

});

//수량입력
document.getElementById('totalQty').addEventListener('input', (e) => {

    document.getElementById('product-total-error').innerText = '';

});




//파일 validation, 파일 뿌려주기
document.getElementById('file').addEventListener('change', (e) => {
    const maxFiles = 3;
    const fileList = e.target.files;
    const output = document.getElementById('fileList');
    output.innerHTML = '';

    if (fileList.length > maxFiles) {
        alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다`);
        document.getElementById('file').value = '';
    } else {
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.width = '124px';
                    img.style.height = 'auto';
                    img.style.marginRight = '10px';
                    img.style.borderRadius = '5px';
                    output.appendChild(img);
                };
                reader.readAsDataURL(file);
            } else {
                alert('이미지 파일만 가능합니다.');
                document.getElementById('file').value = '';
                output.innerHTML = '';
                break;
            }
        }
    }
});

//파일 validation, 파일 뿌려주기
document.getElementById('files').addEventListener('change', (e) => {
    const maxFiles = 3;
    const fileList = e.target.files;
    const output = document.getElementById('filesList');
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
                    img.style.width = '111px';
                    img.style.height = '134px';
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

//취소버튼 클릭
document.getElementById('cancel-button').addEventListener('click', () => {
    if (confirm('상품등록을 취소하시겠습니까?')) {
        location.href = '/';
    }
});

//등록버튼 클릭 Validation
document.getElementById('register-button').addEventListener('click', (e) => {

    const productNameInput = document.getElementById('product-name-input');
    const productName = productNameInput.value.trim();
    const productDescInput = document.getElementById('product-description-input');
    const productDesc = productDescInput.value.trim();
    const productNameError = document.getElementById('product-name-error');
    const productDescError = document.getElementById('product-desc-error');
    const priceInput = document.getElementById('price');
    const price = priceInput.value.trim();
    const priceError = document.getElementById('product-price-error');
    const totalQtyInput = document.getElementById('totalQty');
    const totalQty = totalQtyInput.value.trim();
    const totalQtyError = document.getElementById('product-total-error');
    const category = document.getElementById('categorySelect');
    const productCategoryError = document.getElementById('product-category-error');
    const file = document.getElementById('file');
    const files =  document.getElementById('files');

    // 초기화
    productNameError.innerText = '';
    productDescError.innerText = '';
    priceError.innerText = '';
    totalQtyError.innerText = '';
    productCategoryError.innerText = '';

    // 상품이름
    if (productName.length < 2) {
        productNameInput.focus();
        productNameError.innerText = '상품명을 2글자 이상 입력해주세요.';
        productNameInput.scrollIntoView({behavior: 'smooth', block: 'center'});
        return;
    }

    // 상품설명
    if (productDesc.length < 5) {
        productDescInput.focus();
        productDescError.innerText = '상품설명을 5글자 이상 입력해주세요.';
        productDescInput.scrollIntoView({behavior: 'smooth', block: 'center'});
        return;
    }

    if(price.length === 0){
        priceInput.focus();
        priceError.innerText = '가격을 입력해주세요.';
        priceInput.scrollIntoView({behavior: 'smooth', block: 'center'});
        return;
    }

    if(totalQty.length === 0){
        totalQtyInput.focus();
        totalQtyError.innerText = '수량을 입력해주세요.';
        totalQtyInput.scrollIntoView({behavior: 'smooth', block: 'center'});
        return;
    }


    //카테고리 선택
    if(category.value === '---------'){
        productDescInput.focus();
        productCategoryError.innerText = '카테고리를 선택해주세요.';
        category.scrollIntoView({behavior: 'smooth', block: 'center'});
        return;
    }

    //상품대표이미지
    if (file.files.length === 0) {
        alert('상품 대표이미지를 등록해주세요.');
        return;
    }
    
    //세부이미지
    if(files.files.length === 0){
        alert('상품 상세이미지를 등록해주세요.');
        return;
    }

    if(confirm('상품을 등록하시겠습니까?')){
    document.getElementById('register-form').submit();
    }

});


