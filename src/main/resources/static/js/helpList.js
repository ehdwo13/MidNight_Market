// 문의글 작성은 로그인 한 사람만 할 수 있게
document.getElementById('hb').addEventListener('click', ()=>{
    console.log("이벤트리스너 진입");
    if(sesId == null){
        alert("로그인 후 작성 가능합니다.");
    }else{
        window.location.href = "/help/register";
    }
});

// 비밀글은 본인만 볼 수 있게
let secret = document.querySelectorAll('.secret');

for(let i = 0; i<secret.length; i++){
    secret[i].addEventListener('click',(e)=>{
        let hno = e.currentTarget
            .closest("[data-hno]")
            .getAttribute("data-hno");
        if(e.currentTarget.classList.contains('yes')){
            let writer = e.currentTarget.closest("[data-id]").getAttribute("data-id");
            console.log("비밀글")
            console.log(sesId); /*[[${session.id}]] -> 현재 로그인 한 사람의 id(우리는 email형식으로 했음)*/
            console.log(sesName); /*[[${session.name}]] -> 현재 로그인 한 사람의 nickName*/
            if(sesName == writer){
                window.location.href = "/help/detail?hno="+hno;
            }else if(sesName != writer){
                alert("비밀글은 관리자와 작성자만 확인할 수 있습니다.")  //@@@@@@@@@@관리자 부분 추가 필
            }
        }else{
            window.location.href = "/help/detail?hno="+hno;
        }
    });
}

console.log(role);

// 관리자 답글은 비밀글일 경우 관리자랑 본인만 볼 수 있게
let adminReply = document.querySelectorAll('.adminReply');

for(let i=0; i<adminReply.length; i++){
    adminReply[i].addEventListener('click',(e)=>{
        let hno = e.currentTarget.closest("[data-hno]").getAttribute("data-hno");
        let writer = e.currentTarget.closest("[data-id]").getAttribute("data-id");
        console.log(hno, writer);
        let secretCheck = e.currentTarget.closest("[data-secretCheck]").getAttribute("data-secretCheck")
        let replyCheck = e.currentTarget.closest("[data-replyCheck]").getAttribute("data-replyCheck")
        console.log(secretCheck, replyCheck);

        if(sesName != writer && secretCheck== "Y" && role != "role_admin"){
        // if((sesName != writer && secretCheck== "Y") || (role != "role_admin" && secretCheck== "Y")){
            alert("비밀글은 본인과 관리자만 확인 가능합니다.");
        }else{
            window.location.href = "/help/replyAns?hno="+hno;
        }
    });
}

// // 내가 쓴 글만 리스트 뽑기
// document.getElementById('myHelpBtn').addEventListener('click', (e)=>{
//
//
//     let listArr = [];
//
//     for(let i=0; i<list; i++){ //list = [[${list}]]
//         if(sesName == writer){
//             listArr.push(list[i]);
//         }
//     }
//     mypost(listArr);
//     console.log(listArr);
// });
//
// function mypost(post){
//     let tbody = document.querySelector("tbody");
//     tbody.innerHTML = ''; //tbody값 초기화
//
//     let tr = '';
//
//     for(let i=0; i<post.length; i++){
//         let p = post[i];
//         tr += `<tr>
//                 <td>${p.hno}</td>
//                 <td><a href="/help/detail?hno=${p.hno}">${p.secret === 'Y' ? '비밀글입니다.' : p.title}</a></td>
//                 <td>${p.id}</td>
//                 <td>${p.regAt}</td>
//                 <td>${p.reply === 'N' || p.reply === 'n' ? '답변대기' : '답변완료'}</td>
//             </tr>`;
//
//         if(p.replyContent == 'Y'){
//             tr += `<tr>
//                     <td colspan="5" class="replyAdmin">
//                         <a href="/help/replyAns?hno=${p.hno}">┗ 관리자 답변입니다.</a>
//                     </td>
//                 </tr>`;
//         }
//     }
//     tbody.innerHTML = tr;
//
// }