document.querySelector('.j-btn-test').addEventListener('click', function() {
    const btnIcon = this.querySelector('.btn_icon');
    const isIcon01 = btnIcon.classList.contains('icon_01');

    if (isIcon01) {
        btnIcon.classList.remove('icon_01');
        btnIcon.classList.add('icon_02');
        btnIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-left-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-5.904-2.803a.5.5 0 1 1 .707.707L6.707 10h2.768a.5.5 0 0 1 0 1H5.5a.5.5 0 0 1-.5-.5V6.525a.5.5 0 0 1 1 0v2.768z"/>
      </svg>`;
    } else {
        btnIcon.classList.remove('icon_02');
        btnIcon.classList.add('icon_01');
        btnIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-left-circle" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-5.904-2.854a.5.5 0 1 1 .707.708L6.707 9.95h2.768a.5.5 0 1 1 0 1H5.5a.5.5 0 0 1-.5-.5V6.475a.5.5 0 1 1 1 0v2.768z"/>
      </svg>`;
    }
});

document.querySelector('.screen-size').addEventListener('click', function() {
  alert("ширина документа: " + document.documentElement.clientHeight + "px, высота документа:" +  document.documentElement.clientWidth + "px");
});


const ws = new WebSocket('wss://echo-ws-service.herokuapp.com');
const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const locationButton = document.getElementById('locationButton');
const messagesWindow = document.getElementById('messages-window');

function appendMessage(message, isSender, isLink = false) {
    const messageElement = document.createElement('div');
    if (isLink) {
        const link = document.createElement('a');
        link.setAttribute('href', message);
        link.setAttribute('target', '_blank'); // Открытие ссылки в новой вкладке
        link.textContent = 'Моя геолокация';
        messageElement.appendChild(link);
    } else {
        messageElement.textContent = message;
    }
    
    messageElement.className = isSender? 'sended' : 'recieved';
    messagesWindow.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
}

sendButton.onclick = function() {
    const message = messageInput.value;
    if (message) {
        ws.send(message);
        appendMessage(message, true);
        messageInput.value = '';
    }
};

ws.onmessage = function(event) {
    appendMessage(event.data, false);
};

locationButton.onclick = function() {
    if (!navigator.geolocation) {
        alert('Геолокация не поддерживается вашим браузером');
    } else {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const message = `https://www.openstreetmap.org/#map=18/${lat}/${lon}`;
                appendMessage(message, true, true);
            },
            () => {
                alert('Не удалось получить ваше местоположение');
            }
        );
    }
};
