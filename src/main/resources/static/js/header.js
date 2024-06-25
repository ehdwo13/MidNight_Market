if (document.getElementById("isReset") != null) {
    const width = 600;
    const height = 600;

    // 화면의 크기를 가져옴
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    // 팝업 창의 위치를 계산
    const left = (screenWidth / 2) - (width / 2);
    const top = (screenHeight / 2) - (height / 2);
    alert("비밀번호가 초기화되었습니다.\n다시 설정해주세요.");
    openPop = window.open('/login/reset', '비밀번호변경', `width=${width},height=${height},scrollbars=yes,left=${left},top=${top}`);

    let id = document.getElementById('idValue').innerText;
    openPop.onload = function () {
        openPop.document.getElementById('id').value = id;
    }
    const popupInterval = setInterval(function () {
        if (openPop.closed) {
            clearInterval(popupInterval);
            logout().then(result => {
                location.reload();
            })
        }
    }, 500);
}

async function logout() {
    try {
        const url = '/logout';
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        };
        const response = await fetch(url, config);

        if (response.ok) {
            window.location.href = '/login'; // 로그인 페이지로 리디렉션
        } else {
            console.error('로그아웃 실패:', response.statusText);
        }
    } catch (error) {
        console.error('로그아웃 중 오류 발생:', error);
    }
}

$('#autoComplete').autocomplete({
    source: function (request, response) {
        $.ajax({
            url: "/ajax/autocomplete.do",
            type: "POST",
            dataType: "JSON",
            data: {value: request.term},
            success: function (data) {
                response(
                    $.map(data.resultList, function (item) {
                        return {
                            label: item.name,
                            value: item.name
                        };
                    })
                );
            },
            error: function () {
                alert("오류가 발생했습니다.");
            }
        });
    },
    focus: function (event, ui) {
        return false;
    },
    minLength: 1,
    autoFocus: true,
    delay: 100,
    select: function (evt, ui) {
    },
    open: function () {
        $('#recentSearch').hide();
    }
});
document.getElementById('autoComplete').addEventListener('focus', () => {
    let saveStatus = window.localStorage.getItem("saveStatus");
    let searchHistory = window.localStorage.getItem("searchHistory");
    if(saveStatus == "false") {
        document.getElementById('recentSearch').style.display = '';
        document.getElementById('recentSearch').innerHTML = `<button style="border: none; background-color: white; margin: 20px 0 20px 0" id="offRecent">최근검색어 저장 켜기</button>`
    }else{
        document.getElementById('recentSearch').style.display = '';
        let parseData = JSON.parse(searchHistory);
        let count = 1;
        if(parseData != null){
            document.getElementById('recentSearch').innerHTML = '';
            for (let i = parseData.length - 1; i >= 0; i--) {
                document.getElementById('recentSearch').innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
                <a href="/product/list?type=product&search=${parseData[i]}" id="aId${count}">${parseData[i]}</a><button type="button" class="delBtn" id="delBtn${count}" style="border: none; background-color: white; color: rgba(116,116,116,0.8); font-size: 20px">X</button><br>`;
                count++;
            }
            document.getElementById('recentSearch').innerHTML += `<button style="border: none; background-color: white; margin: 20px 0 20px 0" id="delAll">&nbsp;&nbsp;전체 삭제 &nbsp; | </button>`
            document.getElementById('recentSearch').innerHTML += `<button style="border: none; background-color: white; margin: 20px 0 20px 0" id="offRecent">최근검색어 저장 끄기</button>`
        }
    }
});
function searchPrevVal(word){
    let prevData = window.localStorage.getItem("searchHistory");
    let parsingData = JSON.parse(prevData);
    for(let i=0; i<parsingData.length; i++){
        if(parsingData[i] == word){
            return false;
        }else{
            return true;
        }
    }
}


document.getElementById('searchButton').addEventListener('click', (e) => {
    let saveStatus = window.localStorage.getItem("saveStatus");
    if(saveStatus == null){
        window.localStorage.setItem("saveStatus", "true");
    }
    let searchVal = document.getElementById('autoComplete').value;
    if(searchVal == null || searchVal.length === 0){
        alert("검색어가 공백입니다. ");
    }else{
        if(saveStatus == "true" || saveStatus == null){
            let prevData = window.localStorage.getItem("searchHistory");
            if (prevData == null) {
                let saveHistoryArr = [];
                saveHistoryArr.push(searchVal);
                window.localStorage.setItem("searchHistory", JSON.stringify(saveHistoryArr));
            } else {
                if(searchPrevVal(searchVal)){
                    let prev = JSON.parse(prevData);
                    prev.push(searchVal);
                    window.localStorage.setItem("searchHistory", JSON.stringify(prev));
                }else{
                    let prev = JSON.parse(prevData);
                    let index;
                    for(let i=0; i<prev.length; i++){
                        if(prev[i]==searchVal){
                            index = i;
                        }
                    }
                    prev.splice(index,1);
                    prev.push(searchVal);
                    window.localStorage.setItem("searchHistory", JSON.stringify(prev));
                }
            }
        }
        let search = encodeURI(searchVal);
        window.location.href = `/product/list?type=product&search=${search}`;
    }
});
document.body.addEventListener('click',(e)=>{
    let str = e.target.id;
    if (str.includes('aId')) {
        let num = parseInt(str.replace('aId', ''));
        let storage = window.localStorage.getItem("searchHistory");
        let parseData = JSON.parse(storage);
        let delNum = parseData.length-num;
        parseData.splice(delNum, 1);
        let clickVal = document.getElementById(str).innerText;
        parseData.push(clickVal);
        let stringifyArr = JSON.stringify(parseData);
        window.localStorage.setItem("searchHistory", stringifyArr);
    }
})

document.getElementById('recentSearch').addEventListener('click', (e) => {
    let str = e.target.id;
    if (str.includes('delBtn')) {
        let id = e.target.id;
        let num = parseInt(id.replace('delBtn', ''));
        let storage = window.localStorage.getItem("searchHistory");
        let parseData = JSON.parse(storage);
        let delNum = parseData.length-num+1;
        parseData.splice(delNum-1, 1);
        let stringifyArr = JSON.stringify(parseData);
        window.localStorage.setItem("searchHistory", stringifyArr);

        document.getElementById('recentSearch').innerHTML = '';
        let count = 1;
        for (let i = parseData.length - 1; i >= 0; i--) {
            document.getElementById('recentSearch').innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
                <a href="/product/list?type=product&search=${parseData[i]}" id="aId${count}">${parseData[i]}</a><button type="button" class="delBtn" id="delBtn${count}" style="border: none; background-color: white; color: rgba(116,116,116,0.8); font-size: 20px">X</button><br>`;
            count++;
        }
        document.getElementById('recentSearch').innerHTML += `<button style="border: none; background-color: white; margin: 20px 0 20px 0" id="delAll">&nbsp;&nbsp;전체 삭제 &nbsp; | </button>`
        document.getElementById('recentSearch').innerHTML += `<button style="border: none; background-color: white; margin: 20px 0 20px 0" id="offRecent">최근검색어 저장 끄기</button>`
    }else if(e.target.id == "delAll"){
        e.preventDefault();
        window.localStorage.removeItem("searchHistory");
        document.getElementById('recentSearch').innerHTML = `<button style="border: none; background-color: white; margin: 20px 0 20px 0" id="delAll">&nbsp;&nbsp;전체 삭제 &nbsp; | </button>`;
        document.getElementById('recentSearch').innerHTML += `<button style="border: none; background-color: white; margin: 20px 0 20px 0" id="offRecent">최근검색어 저장 끄기</button>`
    }else if(e.target.id == "offRecent"){
        e.preventDefault();
        let saveStatus = window.localStorage.getItem("saveStatus");
        if(saveStatus == "true") {
            saveOff();
            window.localStorage.removeItem("searchHistory");
            document.getElementById('recentSearch').innerHTML = `<button style="border: none; background-color: white; margin: 20px 0 20px 0" id="offRecent">최근검색어 저장 끄기</button>`
            document.getElementById('offRecent').innerHTML = "최근검색어 저장 켜기"
        }else{
            saveOff();
            document.getElementById('offRecent').innerHTML = "최근검색어 저장 끄기"
        }
    }else{

    }
});
function handleEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
}
const autoCompleteInput = document.getElementById('autoComplete');
const recentSearchDiv = document.getElementById('recentSearch');

autoCompleteInput.addEventListener('blur', (e) => {
    if (!e.relatedTarget || !isDescendant(recentSearchDiv, e.relatedTarget)) {
        recentSearchDiv.style.display = "none";
    }
});

recentSearchDiv.addEventListener('focus', () => {
    recentSearchDiv.style.display = "block";
});

function isDescendant(parent, child) {
    let node = child.parentNode;
    while (node != null) {
        if (node === parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

function saveOff(){
    let saveStatus = window.localStorage.getItem("saveStatus");
    if(saveStatus == "true"){
        window.localStorage.setItem("saveStatus", "false");
    }else{
        window.localStorage.setItem("saveStatus", "true");
    }
}
document.body.addEventListener('wheel',()=>{
    document.getElementById('recentSearch').style.display = "none";
    document.getElementById('autoComplete').blur();
})

let notificationDiv = null;

function toggleNotificationContent(event) {
    const content = event.target;
    if (content.style.whiteSpace === 'nowrap') {
        content.style.whiteSpace = 'normal';
    } else {
        content.style.whiteSpace = 'nowrap';
    }
}

async function fetchNotifications() {
    try {
        let response = await fetch('/notification/notifications');
        if (response.ok) {
            let notifications = await response.json();
            // 최근 알림이 가장 위에 오도록 정렬
            notifications.sort((a, b) => new Date(b.notifyDate) - new Date(a.notifyDate));
            return notifications;
        } else {
            console.error('Failed to fetch notifications');
            return [];
        }
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function deleteNotification(content, id) {
    try {
        let response = await fetch(`/notification/${content}/${loginId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            await showNotification();
            await getNotificationCount(loginId)// 알림을 새로고침
        } else {
            console.error('Failed to delete notification');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function showNotification(event) {
    if (loginId == null) {
        alert("로그인이 필요한 서비스입니다.");
        event.preventDefault();
        window.location.href = "http://localhost:8090/login/form";

    } else if(roleHeader == "role_seller" || roleHeader == "role_admin") {
        alert("고객만 사용가능한 서비스입니다. ")
        event.preventDefault();
    } else {
        if (notificationDiv && event) {
            document.body.removeChild(notificationDiv);
            notificationDiv = null;
            return;
        }

        if (!notificationDiv) {
            let button = event ? event.target : document.getElementById('notificationButton');
            let rect = button.getBoundingClientRect();

            notificationDiv = document.createElement('div');
            notificationDiv.className = 'notification';

            let notifications = await fetchNotifications();
            notifications.forEach(notification => {
                let notificationItem = document.createElement('div');
                notificationItem.className = 'notification-item';

                let notificationText = document.createElement('div');
                notificationText.className = 'notification-content';
                notificationText.textContent = notification.notifyContent;
                notificationText.onclick = toggleNotificationContent;

                let notificationTime = document.createElement('div');
                notificationTime.className = 'notification-time';
                let timeVal = getTimeDiff(notification.notifyDate);
                notificationTime.textContent = timeVal;

                let deleteBtn = document.createElement('button');
                deleteBtn.className = 'notification-button';
                deleteBtn.textContent = "X";
                deleteBtn.onclick = function () {
                    deleteNotification(notification.notifyContent, notification.id);
                };

                notificationItem.appendChild(notificationText);
                notificationItem.appendChild(notificationTime);
                notificationItem.appendChild(deleteBtn);
                notificationDiv.appendChild(notificationItem);
            });

            document.body.appendChild(notificationDiv);
            notificationDiv.style.top = (rect.bottom + window.scrollY) + 15 + 'px';
            notificationDiv.style.left = (rect.right + window.scrollX) + 20 - notificationDiv.offsetWidth + 'px';
        } else {
            let notifications = await fetchNotifications();
            notificationDiv.innerHTML = ''; // 기존 알림 내용을 초기화
            notifications.forEach(notification => {
                let notificationItem = document.createElement('div');
                notificationItem.className = 'notification-item';

                let notificationText = document.createElement('div');
                notificationText.className = 'notification-content';
                notificationText.textContent = notification.notifyContent;
                notificationText.onclick = toggleNotificationContent;

                let notificationTime = document.createElement('div');
                notificationTime.className = 'notification-time';
                let timeVal = getTimeDiff(notification.notifyDate);
                notificationTime.textContent = timeVal;

                let deleteBtn = document.createElement('button');
                deleteBtn.className = 'notification-button';
                deleteBtn.textContent = "X";
                deleteBtn.onclick = function () {
                    deleteNotification(notification.notifyContent, notification.id);
                };

                notificationItem.appendChild(notificationText);
                notificationItem.appendChild(notificationTime);
                notificationItem.appendChild(deleteBtn);
                notificationDiv.appendChild(notificationItem);
            });
        }
    }
}

document.getElementById('notificationButton').onclick = showNotification;


function getTimeDiff(notificationDate) {
    let currentDate = new Date();
    let notifyDate = new Date(notificationDate);
    let diffMs = currentDate - notifyDate;

    let diffMinutes = Math.round(diffMs / 60000); // 60000 밀리초(ms) = 1분

    if (diffMinutes < 1) {
        return "방금 전";
    } else if (diffMinutes < 60) {
        return `${diffMinutes}분 전`;
    } else if (diffMinutes < 1440) {
        let hours = Math.floor(diffMinutes / 60);
        return `${hours}시간 전`;
    } else {
        let days = Math.floor(diffMinutes / 1440);
        return `${days}일 전`;
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const navigationButton = document.querySelectorAll('.bar');

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const type = urlParams.get('type'); // 'sale'
    const category = urlParams.get('category'); // ''
    const categoryDetail = urlParams.get('categoryDetail'); // ''
    // const subType = urlParams.get('subType'); // ''
    const search = urlParams.get('search'); // ''

    const url = new URL(window.location.href);
    const path = url.pathname;



    if (search !== null && search !== '') {// 검색을 한 경우
        return;
    }

    if (type === 'sale') { //카테고리 또는 카테고리 디테일 클릭경우
        navigationButton[1].style.color = 'black';
        navigationButton[1].style.fontSize = '22px';
        return;
    }

    if (type === 'best') { //베스트상품일 경우
        navigationButton[2].style.color = 'black';
        navigationButton[2].style.fontSize = '22px';
        return;
    }

    if (type === 'new') { //신상품일 경우
        navigationButton[3].style.color = 'black';
        navigationButton[3].style.fontSize = '22px';
        return;
    }

    if (path.includes('help') || path.includes('notice')) {//고객센터를 누르거나 고객센터 서브메뉴를 눌렀을 경우
        navigationButton[4].style.color = 'black';
        navigationButton[4].style.fontSize = '22px';
        return;
    }

    if (category !== null || categoryDetail !== null || search === '') {//카테고리 또는 카테고리 디테일 클릭경우
        navigationButton[0].style.color = 'black';
        navigationButton[0].style.fontSize = '22px';
    }

});


//장바구니 카운트 가져오기
async function GetBasketQuantity(customerId) {

    if (customerId == null || customerId === '') {
        return;
    }

    try {
        const response = await fetch('/basket/getBasketQuantity/' + customerId);
        const result = await response.text();

        if (result !== null || result !== '') {
            document.getElementById('basketBadge').innerText = result; //값 집어넣음
        }

    } catch (e) {

    }

}
//알림 배지 카운트 가져오기
async function getNotificationCount(customerId) {
    try {
        const response = await fetch('/notification/count/' + customerId);
        const result = await response.text();

        if (result !== null || result !== '') {
            document.getElementById('notiBadge').innerText = result; //값 집어넣음
        }

    } catch (e) {

    }
}