    function updateCategoryOptions() {
    let categorySelect = document.getElementById("categorySelect");
    let categoryDetailSelect = document.getElementById("categoryDetailSelect");

    // 기존 옵션들을 모두 제거합니다
    categoryDetailSelect.innerHTML = "";

    for(let i=0; i<productDTO.pcdList.length; i++){

        if(productDTO.pcdList[i].productCategoryId == categorySelect.value){
            let option = document.createElement('option');
            option.text = productDTO.pcdList[i].name;
            option.value = productDTO.pcdList[i].id;
            categoryDetailSelect.add(option);
        }

    }
}
