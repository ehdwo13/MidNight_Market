async function sendNumber(){
    let mail = document.getElementById('customerEmail').value;
    try {
        const url = '/mail/mailSend/'+mail;
        const config = {
            method: 'GET'
        };
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (error) {
        console.log(error);
    }
}
document.getElementById('sendBtn').addEventListener('click', ()=>{
    sendNumber().then(result =>{
        alert("이메일 전송 완료");
        sendAuthNum();
        document.getElementById('mail_number').style.display="";
    });
});
async function confirmNumber(){
    let inputNumber = document.getElementById('number').value;
    try {
        const url = '/mail/mailCheck/'+inputNumber;
        const config = {
            method: 'GET'
        };
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (error) {
        console.log(error);
    }
}
document.getElementById('confirmBtn').addEventListener('click', ()=>{
    confirmNumber().then(result=>{
        console.log(result);
        if(result === "1"){
            alert("인증번호 확인 완료.");
            document.getElementById('mail_number').style.display="none";
            document.getElementById('checkBtn').style.display="none";
            document.getElementById('sendBtn').style.display="none";
        }else{
            alert("인증번호가 다릅니다. 다시 입력해주세요.")
        }
    })
})



let timer;
let isRunning = false;
let leftSec = 180;
let display = document.getElementById('timer')

function sendAuthNum(){
    if (isRunning){
        clearInterval(timer);
    }
    startTimer(leftSec, display);
}
function startTimer(count, display) {
    let minutes, seconds;
    display.style.color = 'red';
    timer = setInterval(function () {
        minutes = parseInt(count / 60, 10);
        seconds = parseInt(count % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.innerText = minutes + ":" + seconds;
        if (--count < 0) {
            clearInterval(timer);
            display.innerText = "";
            isRunning = false;
        }
    }, 1000);
    isRunning = true;
}

// 배송지 등록
function daumPost() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분
            // 각 주소의 노출 규칙에 따라 주소를 조합
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가짐
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져옴
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합
            if(data.userSelectedType === 'R'){
                // 법정동명이 있을 경우 추가 (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝남
                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraAddr += data.bname;
                }
                // 건물명이 있고 공동주택일 경우 추가
                if(data.buildingName !== '' && data.apartment === 'Y'){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
            } else {
                document.getElementById("sample6_extraAddress").value = '';
            }
            // 우편번호와 주소 정보를 해당 필드에 넣음
            document.getElementById('sample6_postcode').value = data.zonecode;
            document.getElementById("sample6_address").value = addr;

            // 커서를 상세주소 필드로 이동
            document.getElementById("sample6_detailAddress").focus();
        }
    }).open();
}
document.getElementById('joinBtn').addEventListener('click',()=>{
    let code = document.getElementById('sample6_postcode').value;
    let add1 = document.getElementById('sample6_address').value;
    let add2 = document.getElementById('sample6_detailAddress').value;
    document.getElementById('address').value = code+"/"+add1+"/"+add2;
});
// 이용약관
const joinBtn = document.getElementById('joinBtn');
joinBtn.disabled = 'disabled';
const pchkBoxes = document.querySelectorAll('input[name="chk"]'); // 필수약관
const cchkBoxes = document.querySelectorAll('input[name="chk1"]'); // 선택약관

function chkAll(isChecked) {
    // 모든 체크박스를 루프 돌며 상태를 chkAll과 동일하게 설정
    pchkBoxes.forEach((checkbox) => {
        checkbox.checked = isChecked;
    });
    cchkBoxes.forEach((checkbox) => {
        checkbox.checked = isChecked;
    });
    // 최소 두 개의 체크박스가 선택되었는지 확인하여 가입하기 버튼을 활성화
    const checkedCount = Array.from(pchkBoxes).filter((checkbox) => checkbox.checked).length;
    joinBtn.disabled = checkedCount < 2;
}

// chkAll 체크박스에 이벤트 리스너 추가
document.querySelector('#chk').addEventListener('change', function () {
    chkAll(this.checked);
});

// 가입하기 버튼을 업데이트하는 개별 체크박스에 이벤트 리스너 추가
const inCheckboxes = document.querySelectorAll('input[name="chk"]');
inCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
        const checkedCount = Array.from(inCheckboxes).filter((checkbox) => checkbox.checked).length;
        joinBtn.disabled = checkedCount < 2;
    });
});
function agreement(){
    alert("이용약관에 동의하셨습니다.")
}
function disagreement(){
    alert("이용약관 필수사항에 동의하시지 않으셨습니다.")
}
document.getElementById('checkBtn').addEventListener('click', ()=>{
    let email = document.getElementById('customerEmail').value;
    if(validateEmail(email)){
        checkEmail(email).then(result =>{
            if(result === "1"){
                alert("이미 있는 이메일입니다. 다시 입력해주세요. ");
                document.getElementById("customerEmail").value = '';
            }else{
                alert("사용가능한 이메일입니다. ");
                document.getElementById('sendBtn').style.display = '';
            }
        })
    }else{
        alert("이메일 주소가 올바르지 않습니다. 이메일 주소를 정확하게 입력해주세요.");
        document.getElementById("customerEmail").value = '';
    }
});
async function checkEmail(email) {
    try {
        const url = '/customer/check/'+email;
        const config = {
            method: 'GET'
        };
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (error) {
        console.log(error);
    }
}
function validateEmail(email) {
    // 이메일 형식을 검사하는 정규 표현식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
document.getElementById('p').addEventListener("change", ()=> {
    let p = document.getElementById('p').value;
    if(!validPW(p)){
        document.getElementById('validText').style.display = '';
        document.getElementById('validText').style.color ="red";
        document.getElementById('validText').innerText = " 비밀번호는 8글자 이상, 영문, 숫자, 특수문자를 포함해야 합니다. "
    }else{
        document.getElementById('validText').style.display = 'none';
    }
})
document.getElementById('pc').addEventListener("change", ()=>{
    let pc = document.getElementById('pc').value;
    let p = document.getElementById('p').value;
    if(p !== pc){
        document.getElementById('checkPw').style.display = '';
        document.getElementById('checkPw').style.color ="red";
        document.getElementById('checkPw').innerText = "입력하신 패스워드가 동일하지 않습니다. "
    }else{
        document.getElementById('checkPw').style.display = 'none';
    }
})
function validPW (pw) {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(pw);
}
document.getElementById('checkNick').addEventListener('click', ()=>{
    let nickName = document.getElementById('n').value;
    checkNick(nickName).then(result=>{
        if(result === "1"){
            alert("이미 있는 닉네임입니다. 다시 입력해주세요. ");
            document.getElementById("n").value = '';
        }else{
            alert("사용가능한 닉네임입니다. ");
        }
    })

})
async function checkNick(nickName) {
    try {
        const url = '/customer/checkN/'+nickName;
        const config = {
            method: 'GET'
        };
        const resp = await fetch(url, config);
        const result = await resp.text();
        return result;
    } catch (error) {
        console.log(error);
    }
}