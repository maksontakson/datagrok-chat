var stompClient = null;

const colMd = document.getElementsByClassName("col-md-6");

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/greetings', function (greeting) {
            showGreeting(JSON.parse(greeting.body).content);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    const tag = document.createElement('p');
    const value = $("#name").val();
    tag.innerHTML = `Your name is: ${value}`;
    var pTags = colMd[0].getElementsByTagName('p');
    if(pTags[0] != null) {
        pTags[0].remove();
    }
    colMd[0].append(tag);
}

function sendMessage() {
    stompClient.send("/app/hello", {}, JSON.stringify({'name':$("#name").val(), 'content': $("#message").val()}));
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#sendName" ).click(function() { sendName(); });
    $( "#sendMessage" ).click(function() { sendMessage(); });
});

