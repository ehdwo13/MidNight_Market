function blank(){
    const title = document.getElementById('title').value.trim().length; //문자 앞뒤 공백 제거
    const content = document.getElementById('content').value.trim();
    if(title === 0){
        alert("문의 제목을 입력해주세요.");
        return false;
    }else if(content === ''){
        alert("문의 내용을 입력해주세요.");
        return false;
    }else{
        alert("질문이 등록되었습니다.\n답변 소요일은 1~2일입니다.");
        return true;
    }
}

document.getElementById('regBtn').addEventListener('click', function (e){
    if (!blank()) {
        e.preventDefault(); // blank() 함수가 false이면 폼 제출 안됨 // preventDefault() : 동작막음
    }
});

function checkSecret() {
    const secret = document.getElementById('secret');
    const secretHidden = document.getElementById('secretHidden');

    secretHidden.value = secret.checked ? 'Y' : 'N';
}

