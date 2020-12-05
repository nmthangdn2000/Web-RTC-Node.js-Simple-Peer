const mess = document.getElementById('editTex-chat')
mess.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendMess(mess.value)
    }
});

function sendMess(value) {
    console.log(socketidUser);
    peers[socketidUser].send(value)
    peers[socketidUser].on('data', data => console.log(data))
}