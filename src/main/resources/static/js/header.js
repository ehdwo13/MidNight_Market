if (document.getElementById("isReset") != null) {
    const width = 600;
    const height = 600;

    // 화면의 크기를 가져옴
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    // 팝업 창의 위치를 계산
    const left = (screenWidth / 2) - (width / 2);
    const top = (screenHeight / 2) - (height / 2);
    alert("비밀번호가 초기화되었습니다. 다시 설정해주세요.");
    openPop = window.open('/login/reset', '비밀번호변경', `width=${width},height=${height},scrollbars=yes,left=${left},top=${top}`);

    let id = document.getElementById('idValue').innerText;
    openPop.onload = function() {
        openPop.document.getElementById('id').value = id;
    }
    const popupInterval = setInterval(function() {
        if (openPop.closed) {
            clearInterval(popupInterval);
            logout().then(result => {
                console.log(result);
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
    source: function(request, response) {
        $.ajax({
            url: "/ajax/autocomplete.do",
            type: "POST",
            dataType: "JSON",
            data: { value: request.term },
            success: function(data) {
                response(
                    $.map(data.resultList, function(item) {
                        return {
                            label: item.name,
                            value: item.name
                        };
                    })
                );
            },
            error: function() {
                alert("오류가 발생했습니다.");
            }
        });
    },
    focus: function(event, ui) {
        return false;
    },
    minLength: 1,
    autoFocus: true,
    delay: 100,
    select: function(evt, ui) {
        console.log(ui.item.label);
    },
    open: function() {
        $('#recentSearch').hide();
    }
});

document.getElementById('autoComplete').addEventListener('focus', () => {
    document.getElementById('recentSearch').style.display = 'block';
    let searchHistory = window.localStorage.getItem("searchHistory");
    let parseData = JSON.parse(searchHistory);
    let count = 1;
    document.getElementById('recentSearch').innerHTML = ''; // Clear previous entries
    for (let i = 0; i < parseData.length; i++) {
        document.getElementById('recentSearch').innerHTML += `<a href="/product/list?type=${parseData[i]}" style="color: black">${parseData[i]}</a><button type="button" id="delBtn${count}" style="border: none; background-color: white">X</button><br>`;
        count++;
    }
});

document.getElementById('searchButton').addEventListener('click', () => {
    let searchVal = document.getElementById('autoComplete').value;
    let prevData = window.localStorage.getItem("searchHistory");
    if (prevData == null) {
        let saveHistoryArr = [];
        saveHistoryArr.push(searchVal);
        window.localStorage.setItem("searchHistory", JSON.stringify(saveHistoryArr));
    } else {
        let prevArr = JSON.parse(prevData);
        prevArr.push(searchVal);
        window.localStorage.setItem("searchHistory", JSON.stringify(prevArr));
    }
});

document.getElementById('recentSearch').addEventListener('click', (e) => {
    let str = e.target.id;
    if (str.includes('delBtn')) {
        console.log("test");
        let id = e.target.id;
        let num = parseInt(id.replace('delBtn', '')); // Parse button number
        let storage = window.localStorage.getItem("searchHistory");
        let parseData = JSON.parse(storage);

        // num-1 위치의 요소를 제거
        parseData.splice(num - 1, 1);

        // 수정된 배열을 다시 JSON 문자열로 변환하여 저장
        let stringifyArr = JSON.stringify(parseData);
        window.localStorage.setItem("searchHistory", stringifyArr);

        // 최근 검색어 목록 업데이트
        document.getElementById('recentSearch').innerHTML = '';
        let count = 1;
        for (let i = 0; i < parseData.length; i++) {
            document.getElementById('recentSearch').innerHTML += `<a href="/product/list?type=${parseData[i]}">${parseData[i]}</a><button type="button" id="delBtn${count}" style="border: none; background-color: white">X</button><br>`;
            count++;
        }
    }
});

// document.getElementById('autoComplete').addEventListener('blur', () => {
//     document.getElementById('recentSearch').innerText = '';
//     document.getElementById('recentSearch').style.display = 'none';
// });
