/*
3. Czat z użyciem Node.js i WebSockets
Stwórz czat, który wykorzystywał będzie serwer utworzony za pomocą platformy Node.js, a także protokół WebSockets, który umożliwi dwukierunkowe przesyłanie danych. Daj użytkownikom możliwość podania swojego pseudonimu. Zaimplementuj również wyświetlanie statusów, gdy ktoś dołączy do czata lub czat opuści. Wszystkie przesyłane wiadomości, a także statusy, powinny być widoczne dla wszystkich podłączonych klientów.
*/


(function() {

var chat = {


    formatTime: function(date) { 
        var hours = date.getHours(),
            min = date.getMinutes(),
            sec = date.getSeconds();

        if(hours < 10) hours = "0" + hours;
        if(min < 10) min = "0" + min;        
        if(sec < 10) hours = "0" + sec;

        return hours + ":" + min + ":" + sec;
    },


    renderChatRow: function(dataObj) {

        var chatRow = document.createElement("div"),
            time = this.formatTime(new Date()),
            message;

        chatRow.classList.add("chatRow"); 

        if(dataObj.type == "status"){
            message = "<span class='status'>" + dataObj.message + "</span>";
        }else{
            message = "<span class='nick'>" + dataObj.name + "</span><span class='message'>" + dataObj.message + "</span>";
        }

        chatRow.innerHTML = "<span class='time'>" + time + "</span>\n" + message; 

        this.chatWindow.appendChild(chatRow); 

        this.chatWindow.scrollTop = this.chatWindow.scrollHeight; 

    },




    sendData: function(msgObject) {

        var data = JSON.stringify(msgObject);
        this.socket.send(data); 

    },

    displayMessage: function(e) { 

        var dataObject = JSON.parse(e.data); 
        this.renderChatRow(dataObject); 

    },

    sendMessage: function() {
        var message = this.message.value;

        if(message !== "") {
            this.sendData({ 
                type: "message",
                message: message
            });
            this.message.value = ""; 
        }

    },

    joinToChat: function(e) { 
        var name = this.nick.value; 

        if(name !== "") {
            this.sendData({ 
                type: "join",
                name: name
            });

            this.nick.setAttribute("readonly", "readonly");
            e.target.onclick = null;
            e.target.setAttribute("disabled", "disabled");

            this.submitButton.removeAttribute("disabled"); 
            this.submitButton.onclick = this.sendMessage.bind(this);
        }

    },

    stopApp: function() { 

        this.joinButton.onclick = null; 
        this.joinButton.setAttribute("disabled", "disabled"); 

        this.submitButton.onclick = null; 
        this.submitButton.setAttribute("disabled", "disabled"); 

        this.renderChatRow({
            type: "status",
            message: "Przerwano połączenie z serwerem."
        });

    },

    connectToServer: function() { 
        this.socket = new WebSocket("ws://localhost:8001"); 
        this.socket.onmessage = this.displayMessage.bind(this);
        this.socket.onclose = this.stopApp.bind(this);
    },


    init: function() {

        if(!window.WebSocket) return;

        this.nick = document.querySelector("#nick");
        this.joinButton = document.querySelector("#join");
        this.chatWindow = document.querySelector("#chatWindow");
        this.message = document.querySelector("#message");
        this.submitButton = document.querySelector("#submit");

        this.joinButton.onclick = this.joinToChat.bind(this);

        this.connectToServer();

    }

}

chat.init();

})();