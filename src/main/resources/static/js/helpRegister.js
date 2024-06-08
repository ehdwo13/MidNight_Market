document.getElementById('regBtn').addEventListener('click',()=>{
    alert("질문이 등록되었습니다.\n답변 소요일은 1~2일입니다.");
});

function checkSecret() {
    const secret = document.getElementById('secret');
    const secretHidden = document.getElementById('secretHidden');

    secretHidden.value = secret.checked ? 'Y' : 'N';
}

