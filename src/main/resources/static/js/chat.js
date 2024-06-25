window.addEventListener('scroll', function() {
    const scrollButton = document.getElementById('newChat');
    const topBtn = document.getElementById('topBtn');
    if (window.scrollY) {
        scrollButton.style.top = window.scrollY+690 + 'px';
        topBtn.style.top = window.scrollY+630 + 'px';
    }
    if(window.scrollY < 700) {
        topBtn.style.display = 'none';
    }else{
        topBtn.style.display = '';
    }
});
document.getElementById('topBtn').addEventListener('click',()=>{
    window.scrollTo(0,0);
})

async function getChatRoomList(currentId) {
    try {
        const url = '/chat/rooms/' + currentId;
        const config = {
            method: 'GET'
        };
        const resp = await fetch(url, config);
        const result = await resp.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}
async function renderChatRoomList(currentId) {
    try {
        const result = await getChatRoomList(currentId);
        const sidebar = document.getElementById('sidebar');
        sidebar.innerHTML = '';
        const button = document.createElement('button');
        button.id = 'newChat';
        button.innerText = '+';
        sidebar.appendChild(button);
        let lastRoomId = null;
        result.forEach(chatRoom => {
            const roomElement = document.createElement('div');
            roomElement.classList.add('room');
            roomElement.dataset.roomId = chatRoom.id;
            const roomId = document.createElement('p');
            roomId.textContent = `${chatRoom.id}`;
            roomId.style.display = 'none';
            const marketName = document.createElement('p');
            marketName.classList.add("marketName");
            getMarketName(chatRoom.sellerId).then(result =>
                marketName.textContent = result
            );
            roomElement.append(roomId, marketName);
            sidebar.appendChild(roomElement);
            if (lastRoomId === null || chatRoom.id > lastRoomId) {
                lastRoomId = chatRoom.id;
            }
            currentRoomId = lastRoomId;

            roomElement.addEventListener('click', async () => {
                setActiveRoomStyle(roomElement);
                await loadChatRoom(chatRoom.id);
            });
        });
        if (lastRoomId) {
            await loadChatRoom(lastRoomId);
            setActiveRoomStyle(document.querySelector(`[data-room-id='${lastRoomId}']`));
        }
    } catch (error) {
        console.error(error);
    }
}

async function loadChatRoom(chatRoomId) {
    try {
        const url = '/chat/messages/' + chatRoomId;
        const config = {
            method: 'GET'
        };
        const resp = await fetch(url, config);
        if (!resp.ok) {
            throw new Error('Network response was not ok');
        }
        let messages = [];
        try {
            messages = await resp.json();
            displayMessages(messages);
        } catch (e) {
            console.warn(e.message);
        }
    } catch (error) {
        console.error(error.message);
    }
}

function displayMessages(messages) {
    const messagesContainer = document.querySelector('.messages');
    messagesContainer.innerHTML = '';
    let roomId = document.createElement('p');
    roomId.textContent = messages[0].chatRoomId;
    roomId.style.display = 'none';
    roomId.id = 'roomId';
    messagesContainer.appendChild(roomId);
    messages.forEach(message => {
        spreadMessage(message, messagesContainer);
    });
}

function splitDate(time) {
    const parts = time.split('T');
    return {
        datePart: parts[0],
        timePart: parts[1]
    };
}

function spreadMessage(message, messagesContainer) {
    const messageElement = document.createElement('div');
    const date = document.createElement('p');
    const time = document.createElement('p');
    messageElement.textContent = `${message.content}`;
    const timeSplit = splitDate(message.sendTime);
    date.textContent = timeSplit.datePart;
    time.textContent = timeSplit.timePart;
    if (message.senderType === 'customer') {
        messageElement.classList.add('message', 'customer');
        date.classList.add('date','customer')
        time.classList.add('time','customer')
    } else if (message.senderType === 'seller') {
        messageElement.classList.add('message', 'seller');
        date.classList.add('date','seller');
        time.classList.add('time','seller')
    }
    messagesContainer.appendChild(messageElement);
    messagesContainer.appendChild(time);
    let totalHeight = 0;
    messagesContainer.childNodes.forEach(message => {
        totalHeight += message.offsetHeight;
    });

    document.documentElement.scrollTop = totalHeight;
    document.body.scrollTop = totalHeight;
}

function sendMessage(roomId) {
    const inputVal = document.getElementById('inputVal').value;
    let senderType;
    if (role == "role_user") {
        senderType = "customer";
    } else if (role == "role_seller") {
        senderType = "seller";
    }
    const message = {
        chatRoomId: roomId,
        senderId: currentId,
        senderType: senderType,
        content: inputVal
    };
    stompClient.send(`/app/chat.sendMessage`, {}, JSON.stringify(message), function () {
        document.getElementById('inputVal').value = '';
        showMessageOutput(message);
    }, function (error) {
        console.error('Error sending message:', error);
    });
}
document.addEventListener('DOMContentLoaded', async () => {
    let urlParams = new URLSearchParams(window.location.search);
    let paramValue = urlParams.get('param');
    if (paramValue != null) {
        getSellerId(paramValue).then(async result => {
            getChatRoomList(result).then(async roomList => {
                if (roomList == null || roomList.length == 0) {
                    let sellerId = result;
                    const response = await fetch(`/chat/rooms`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: `customerId=${currentId}&sellerId=${sellerId}`
                    });
                    const chatRoom = await response.json();
                    await renderChatRoomList(currentId);
                    await loadChatRoom(chatRoom.id);
                } else {
                    await renderChatRoomList(currentId);
                    const roomId = await getRoomId(currentId, result);
                    if (roomId) {
                        await loadChatRoom(roomId);
                    }
                }
            });
        });
    } else {
        try {
            await renderChatRoomList(currentId);
            if (currentRoomId) {
                await loadChatRoom(currentRoomId);
            }
        } catch (error) {
            console.error(error.message);
        }
    }
});
document.addEventListener('DOMContentLoaded', async () => {
    let urlParams = new URLSearchParams(window.location.search);
    let paramValue = urlParams.get('param');
    if (paramValue != null) {
        const sellerId = await getSellerId(paramValue);
        const roomId = await getRoomId(currentId, sellerId);
        if (roomId) {
            await renderChatRoomList(currentId);
            await loadChatRoom(roomId);
            setActiveRoomStyle(document.querySelector(`[data-room-id='${roomId}']`));
        }
    } else {
        try {
            await renderChatRoomList(currentId);
            if (currentRoomId) {
                await loadChatRoom(currentRoomId);
                setActiveRoomStyle(document.querySelector(`[data-room-id='${currentRoomId}']`));
            }
        } catch (error) {
            console.error(error.message);
        }
    }
});
async function getRoomId(customerId, sellerId){
    const url = "/chat/getRoomId/"+customerId+"/"+sellerId;
    const config = {
        method: 'GET'
    };
    const resp = await fetch(url, config);
    const result = await resp.text();
    return result;
}
document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('room') || event.target.classList.contains('marketName')) {
        const roomElement = event.target.closest('.room');
        if (roomElement) {
            const roomIdElement = roomElement.querySelector('p');
            const chatRoomId = roomIdElement.innerText.trim();
            currentRoomId = chatRoomId;
            let clicked = document.querySelectorAll('[data-room-id]');
            let clickedArray = Array.from(clicked);
            let previousRoomId = null;
            function resetPreviousStyle() {
                if (previousRoomId !== null && previousRoomId < clickedArray.length) {
                    clickedArray[previousRoomId].style.backgroundColor = "";
                }
            }
            clickedArray.forEach(function(element, index) {
                element.addEventListener('click', function() {
                    resetPreviousStyle();
                    element.style.backgroundColor ="#f2cc61";
                    previousRoomId = index;
                });
            });
            if (chatRoomId) {
                loadChatRoom(chatRoomId)
                    .then(() => {
                        console.log('Chat room loaded successfully.');
                    })
                    .catch(error => {
                        console.error(error.message);
                    });
            }
        }
    }
    if (event.target.id === 'send') {
        sendMessage(currentRoomId);
    }
});
function handleKeyDown(event) {
    if (event.key === 'Enter') {
        sendMessage(currentRoomId);
    }
}
async function getMarketName(sellerId){
    try{
        const url = '/seller/getShopName/'+sellerId;
        const config = {
            method: 'GET'
        };
        const resp = await fetch(url, config);
        return await resp.text();
    }catch (e){
        console.log(e);
    }
}
async function getSellerId(marketName){
    try{
        const url = '/seller/getSellerId/'+marketName;
        const config = {
            method: 'GET'
        };
        const resp = await fetch(url, config);
        return await resp.text();
    }catch (e){
        console.log(e);
    }
}

document.body.addEventListener('click', (e) => {
    if (e.target.id == "newChat") {
        const newDiv = document.createElement('div');
        newDiv.classList.add('seller-input-container');

        const textContainer = document.createElement('div');
        textContainer.classList.add('seller-input-text-container');

        const text = document.createElement('p');
        text.classList.add('seller-input-text');
        text.textContent = '쇼핑몰 이름을 입력해주세요. ';

        const closeButton = document.createElement('button');
        closeButton.classList.add('close-button');
        closeButton.textContent = 'X';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(newDiv);
        });

        textContainer.appendChild(text);
        textContainer.appendChild(closeButton);

        const inputContainer = document.createElement('div');
        inputContainer.classList.add('seller-input-input-container');

        const input = document.createElement('input');
        input.classList.add('seller-input-input');
        input.setAttribute('type', 'text');

        const button = document.createElement('button');
        button.classList.add('seller-input-button');
        button.textContent = '검색';

        inputContainer.appendChild(input);
        inputContainer.appendChild(button);

        newDiv.appendChild(textContainer);
        newDiv.appendChild(inputContainer);
        document.body.appendChild(newDiv);

        button.addEventListener('click', async () => {
            const sellerId = await getSellerId(input.value);
            if(sellerId == null || sellerId.length == 0){
                alert("존재하지 않는 판매자입니다. \n확인 후 다시 입력해주세요. ")
            }else{
                const response = await fetch(`/chat/rooms`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `customerId=${currentId}&sellerId=${sellerId}`
                });
                const chatRoom = await response.json();
                renderChatRoomList(currentId);
                await loadChatRoom(chatRoom.id);
                document.body.removeChild(newDiv);
            }
        });
    }
});
let stompClient;

function connect() {
    let socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/{chatRoomId}', function (messageOutput) {
            showMessageOutput(JSON.parse(messageOutput.body));
        });
    });
}

function showMessageOutput(message) {
    const messagesContainer = document.querySelector('.messages');
    const messageElement = document.createElement('div');

    messageElement.classList.add('message');
    messageElement.classList.add(message.senderType);
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = `${message.content}`;

    const time = document.createElement('p');
    time.textContent = getCurrentTime();
    time.classList.add('time');
    time.classList.add(message.senderType);

    messageElement.appendChild(messageContent);
    messagesContainer.appendChild(messageElement);
    messagesContainer.appendChild(time);

    document.getElementById('inputVal').value = '';

    let scrollAmount = 100;
    document.documentElement.scrollTop += scrollAmount;
    document.body.scrollTop += scrollAmount;
}

let currentRoomId = null;

function getCurrentTime() {
    const now = new Date();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    return `${hours}:${minutes}:${seconds}`;
}

function setActiveRoomStyle(roomElement) {
    const clickedRooms = document.querySelectorAll('.room');
    clickedRooms.forEach(room => {
        room.style.backgroundColor = "";
    });
    roomElement.style.backgroundColor = "#f2cc61";
}

connect();