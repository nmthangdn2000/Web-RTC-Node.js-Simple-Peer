const mess = document.getElementById('editTex-chat')
const layout_chat = document.getElementById('chat-layout')
module.exports.sendMess = function sendMess(SOCKETID_USER, socket){
    mess.addEventListener("keyup", function(event) {
        if(event.shiftKey && event.keyCode === 13){
            event.preventDefault();
            mess.innerHTML+= '\n/g'
        }
        else if (event.keyCode === 13) {
            event.preventDefault();
            sendMesss(mess.value, SOCKETID_USER, socket)
            layout_chat.scrollTop = layout_chat.scrollHeight;
        }
    });
    socket.on('send-mess', (value, username) => {
        if(!checkUserChat(username))
            layout_chat.innerHTML += ' <span class="layout-chat-username">'+username+'</span>:<span class="layout-chat-time"> Time</span><div class="layout-chat-value">'+value+'</div>'
        else
            layout_chat.innerHTML += '<div class="layout-chat-value">'+value+'</div>'
    })
}

function sendMesss(value, socketId_user, socket) {
    // console.log("aaaaaaaaaaaaaaaaa"+SOCKETID_USER);
    socket.emit('send-mess', value, socketId_user, ROOM_ID);
    mess.value = ''
    if(!checkUserChat('Tôi'))
        layout_chat.innerHTML += ' <span class="layout-chat-username me-mess">Tôi</span>:<span class="layout-chat-time"> Time</span><div class="layout-chat-value">'+value+'</div>'
    else
        layout_chat.innerHTML += ' <div class="layout-chat-value">'+value+'</div>'
}
// kiểm tra mess cuối cùng là của ai
function checkUserChat(user_name){
    const tagSpan = document.querySelectorAll('#chat-layout .layout-chat-username')
    if(tagSpan.length > 0){
        if(user_name == tagSpan[tagSpan.length - 1].innerHTML)
            return true;
        else 
            return false; 
    }else{
        return false;
    }
}
