var currentProgressbarValue = 0;
var progressBarUpdateInterval = null;

function setProgressBarValue(newValue) {
    if (progressBarUpdateInterval) clearInterval(progressBarUpdateInterval);
    var increaseValue = newValue - currentProgressbarValue;
    if (increaseValue === 0) return;

    var stepValue = increaseValue / 50;

    progressBarUpdateInterval = setInterval(() => {
        currentProgressbarValue += stepValue;

        if (stepValue > 0 && currentProgressbarValue >= newValue) {
            clearInterval(progressBarUpdateInterval);
            currentProgressbarValue = newValue;
        }

        if (stepValue < 0 && currentProgressbarValue <= newValue) {
            clearInterval(progressBarUpdateInterval);
            currentProgressbarValue = newValue;
        }

        var rounded = Math.floor(currentProgressbarValue);
        var barWidth = currentProgressbarValue;

        if (barWidth < 1) barWidth = 0;
        if (barWidth > 100) barWidth = 100;

var progressBarProgressPercentElements = document.querySelectorAll(".progressBarProgressPercent");
progressBarProgressPercentElements.forEach(function (element) {
    element.textContent = rounded + "%";
});

var progressBarProgressElements = document.querySelectorAll(".progressBarProgress");
progressBarProgressElements.forEach(function (element) {
    element.style.width = barWidth + "%";
});

    }, 30);
}

document.addEventListener("DOMContentLoaded", function () {
    let socket;

    function connectWebSocket() {
        if (socket && socket.readyState === WebSocket.OPEN) {
            return;
        }
        if (socket) {
            socket.close();
        }
        socket = new WebSocket('ws://localhost:8211');
    
        socket.addEventListener('open', (event) => {
            //console.log('Conexão WebSocket aberta:', event);
    
            // const message = { 'request': 'Hello from client' };
            // socket.send(JSON.stringify(message));
        });
    
        socket.addEventListener('message', (event) => {
            let data = JSON.parse(event.data);
            var newValue = data.percentage;
            setProgressBarValue(newValue);
            document.querySelector(".progressTitle").textContent = data.title + " - " + data.likes + "/" + data.total_likes;
        });
    
        socket.addEventListener('close', (event) => {
            //console.log('Conexão WebSocket fechada:', event);
        });
    
        socket.addEventListener('error', (event) => {
            //console.error('Erro na conexão WebSocket:', event);
        });
    }
    
    connectWebSocket();
    
    setInterval(() => {
        connectWebSocket();
    }, 5000);
    
});
