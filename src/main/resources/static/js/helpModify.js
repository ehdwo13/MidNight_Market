document.getElementById('modBtn').addEventListener('click',()=>{
    document.getElementById('title').readOnly=false;
    document.getElementById('content').readOnly=false;
    alert("수정이 완료되었습니다.");
});

function checkSecret() {
    const secret = document.getElementById('secret');
    const secretHidden = document.getElementById('secretHidden');

    secretHidden.value = secret.checked ? 'Y' : 'N';
}