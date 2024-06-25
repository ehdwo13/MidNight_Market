let duplicateIdCheck = false;
let duplicateNicknameCheck = false;
let duplicateIdCheckStatus = false;
let duplicateNickNameCheckStatus = false;
let confirmEmailCheck = false;
let confirmPasswordCheck = false;
let confirmRepeatPasswordCheck = false;
function changeVal(){
    let result ={};
    const emailDomain = document.getElementById('emailDomain');
    result.emailDomain = emailDomain.options[emailDomain.selectedIndex].value;
    if(result.emailDomain === "직접입력"){
        document.getElementById('idB').value = "";
    }
    document.getElementById('idB').value = result.emailDomain;
}



async function sendNumber(){
    let mail = document.getElementById('idF').value+"@"+document.getElementById('idB').value;
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
        document.getElementById('customerEmail').value = document.getElementById('idF').value+"@"+document.getElementById('idB').value;
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
        if(result === "1"){
            alert("인증번호 확인 완료.");
            confirmEmailCheck = true;
            document.getElementById('mail_number').style.display="none";
            document.getElementById('checkBtn').style.display="none";
            document.getElementById('sendBtn').style.display="none";
            document.getElementById('customerEmail').value = document.getElementById('idF').value+"@"+document.getElementById('idB').value;
        }else{
            alert("인증번호가 다릅니다.\n다시 입력해주세요.")
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

document.getElementById('checkBtn').addEventListener('click', ()=>{
    duplicateIdCheck = true;
    let email = document.getElementById('idF').value+"@"+document.getElementById('idB').value;
    if(validateEmail(email)){
        checkEmail(email).then(result =>{
            if(result === "1"){
                alert("이미 있는 이메일입니다.\n다시 입력해주세요.");
                document.getElementById("customerEmail").value = '';
            }else{
                alert("사용 가능한 이메일입니다. ");
                duplicateIdCheckStatus = true;
                document.getElementById('sendBtn').style.display = '';
                document.getElementById('customerEmail').value = document.getElementById('idF').value+"@"+document.getElementById('idB').value;
            }
        })
    }else{
        alert("이메일 주소가 올바르지 않습니다.\n이메일 주소를 정확하게 입력해주세요.");
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
        confirmPasswordCheck = true;
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
        confirmRepeatPasswordCheck = true;
    }
})
function validPW (pw) {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(pw);
}
document.getElementById('checkNick').addEventListener('click', ()=>{
    duplicateNicknameCheck = true;
    let nickName = document.getElementById('n').value;
    checkNick(nickName).then(result=>{
        if(result === "1"){
            alert("이미 있는 닉네임입니다.\n다시 입력해주세요. ");
            document.getElementById("n").value = '';
        }else{
            alert("사용가능한 닉네임입니다. ");
            duplicateNickNameCheckStatus = true;
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

// 이용약관
const joinBtn = document.getElementById('joinBtn1');
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
document.getElementById('joinBtn1').addEventListener('click', (e)=>{
    if(duplicateIdCheck == false){
        e.preventDefault();
        alert("아이디 중복체크를 해주세요. ");
    }else if(duplicateNicknameCheck == false){
        e.preventDefault();
        alert("닉네임 중복체크를 해주세요.")
    }else if(duplicateIdCheckStatus == false){
        e.preventDefault();
        alert("아이디 값이 중복입니다.\n다시 체크해주세요. ")
    }else if(duplicateNicknameCheck == false){
        e.preventDefault();
        alert("닉네임 값이 중복입니다.\n다시 체크해주세요. ")
    }else if(confirmEmailCheck == false){
        e.preventDefault();
        alert("이메일 인증을 통과하지 못했습니다.\n다시 시도해주세요. ")
    }else if(confirmPasswordCheck == false){
        e.preventDefault();
        alert("비밀번호가 입력형식에 맞지 않습니다.\n비밀번호는 8글자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.")
    }else if(confirmRepeatPasswordCheck == false){
        e.preventDefault();
        alert("비밀번호 확인란이 동일하지 않습니다.\n다시 입력해주세요. ")
    }
})