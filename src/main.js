let Peer = require('simple-peer')
const socket = io()
const videoGrid = document.getElementById('video-grid')
let peers = {}
let localStream = null
let numberUserConnection = 0
let socketidUser = ''

navigator.mediaDevices.getUserMedia({ video:true, audio: true })
.then(stream => {
    getHours()
    localStream = stream;
    getStream(localStream, "mytabvideo")
    
    socket.emit('join-room',ROOM_ID, USER_NAME)
    socket.emit('NewUser',ROOM_ID)
    socket.on('getsocketid', (id) => {
        socketidUser = id
        // peers[id] = new Peer({ initiator: true, trickle: false, stream: localStream})
    })
    //
    socket.on('initReceive', socket_id => {
        console.log('INIT RECEIVE ' + socket_id)
        addPeer(socket_id, false)

        socket.emit('initSend', socket_id)
        console.log("aaaaaaaaa", peers);
    })
    
    socket.on('initSend', socket_id => {
        console.log('INIT SEND ' + socket_id)
        addPeer(socket_id, true)
    })

    socket.on('signal', data => {
        peers[data.socket_id].signal(data.signal)
    })

    socket.on('numberUser', (number) =>{
        numberUserConnection = number
        document.getElementById('number-user').innerHTML = number
    })

    socket.on('removePeer', socket_id => {
        console.log('removing peer ' + socket_id)
        removePeer(socket_id)
    })

    socket.on('disconnect', () => {
        console.log('GOT DISCONNECTED')
        for (let socket_id in peers) {
            removePeer(socket_id)
        }
    })
    
})
.catch(err => console.log(err))
// socket
socket.on('turn off mic', id => {
    // const elementVideo = document.querySelector('#'+id+' .video')
    // elementVideo.muted = true;
})
socket.on('turn off video', id => {

})
//socket
function removePeer(socket_id) {

    let videoEl = document.querySelector("#"+socket_id+" .video")
    let divVideoEl = document.querySelector("#"+socket_id)
    console.log(videoEl);
    if (videoEl) {

        const tracks = videoEl.srcObject.getTracks();

        tracks.forEach(function (track) {
            track.stop()
        })

        videoEl.srcObject = null
        divVideoEl.remove()
    }
    if (peers[socket_id]) peers[socket_id].destroy()
    delete peers[socket_id]
}
//

function addPeer(socket_id, am_initiator){
    peers[socket_id] = new Peer({ initiator: am_initiator, trickle: false, stream: localStream})

    peers[socket_id].on('signal', data => {
        socket.emit('signal', {
            signal: data,
            socket_id: socket_id
        })
    })

    peers[socket_id].on('stream', stream => {
        getStream(stream, socket_id)
        
    })

    peers[socket_id].on('connect', () => {
        document.getElementById('number-user').innerHTML = numberUserConnection
        changeCss(numberUserConnection)
    })

    peers[socket_id].on('track', (track, stream) => {
        // if(track.length > 0 && stream != null){
            // track[0].enabled = !track[0].enabled
          
        // }
    })

    peers[socket_id].on('error', (err) => {
        console.log("",err);
    })
}

function getStream(stream, socket_id){
    const mdiv = document.createElement('div')
    const myVideo = document.createElement('video')
    // button in video
    const button1 = document.createElement('div')
    const button2 = document.createElement('div')
    button1.classList.add('button-video')
    button1.classList.add('button-pins')
    button1.setAttribute('id', 'button-pins')
    button1.innerHTML += '<ion-icon name="eyedrop" class="button-pins-showlayout"></ion-icon>'
    button2.classList.add('button-video')
    button2.classList.add('button-showlayout')
    button2.innerHTML += '<ion-icon name="volume-high" class="button-pins-showlayout"></ion-icon>'
    button2.setAttribute('id', 'button-showlayout')
    // set event click
    button1.onclick = function() {myOnClickVideo(socket_id, "button1")}
    button2.onclick = function() {myOnClickVideo(socket_id, "button2")}
    //
    mdiv.setAttribute('id', socket_id)
    mdiv.classList.add('box')
    if(socket_id === 1) myVideo.muted = "muted"
    myVideo.classList.add('video')
    myVideo.srcObject = stream
    myVideo.onloadeddata = () => {
        myVideo.play()
    }
    
    mdiv.append(myVideo)
    mdiv.append(button1)
    mdiv.append(button2)
    videoGrid.append(mdiv)
    myVideo.addEventListener('mouseover', function(){mouseHoverVideo(socket_id)})
    myVideo.addEventListener('mouseout', function(){mouseHoverOutVideo(socket_id)})
}

// change css
function changeCss(number){
    console.log(number);
    // const elementVideo = document.getElementsByTagName('video')
    // const css = document.getElementsByClassName('video')
    const classBox = document.getElementsByClassName('box')
    const video = document.querySelectorAll('.box video')
    for (let index = 0; index < number; index++) {
        video[index].style.height = '80%'
        if(number >= 5) {
            classBox[index].style.flex = '1 0 31%'
        }
        else if(number == 1){
            classBox[index].style.flex = '1 0 41%'
            video[index].style.height = '95%'
        } 
    }
}
function myOnClickVideo(id, type){
    const button1 = document.querySelector('#'+id+' #button-pins ion-icon')
    const button2 = document.querySelector('#'+id+' #button-showlayout ion-icon')
    if(type == "button1"){
        if(button1.name == 'eyedrop')
            button1.name = 'backspace'
        else
            button1.name = 'eyedrop'
    }
    else if(type == "button2"){
        if(button2.name == 'volume-high')
            button2.name = 'volume-mute'
        else{
            button2.name = 'volume-high'
        }
        if(id == 'mytabvideo')
            onClickMic() 
    }
}
function mouseHoverVideo(id){
    
    const button1 = document.querySelector('#'+id+' #button-pins')
    const button2 = document.querySelector('#'+id+' #button-showlayout')
    const myVideo = document.querySelector('#'+id+' video')
    button1.style.display = 'block'
    button2.style.display = 'block'
    myVideo.style.opacity = '0.5'
    button1.addEventListener('mouseover', function(){
        button1.style.display = 'block'
        button2.style.display = 'block'
        button1.style.opacity = '60%'
        myVideo.style.opacity = '50%'
    })
    button1.addEventListener('mouseout', function(){
        button1.style.display = 'block'
        button2.style.display = 'block'
        button1.style.opacity = '20%'
        myVideo.style.opacity = '50%'
    })
    button2.addEventListener('mouseover', function(){
        button1.style.display = 'block'
        button2.style.display = 'block'
        button2.style.opacity = '60%'
        myVideo.style.opacity = '0.5'
    })
    button2.addEventListener('mouseout', function(){
        button1.style.display = 'block'
        button2.style.display = 'block'
        button2.style.opacity = '20%'
        myVideo.style.opacity = '50%'
    })
}
function mouseHoverOutVideo(id){
    const myVideo = document.querySelector('#'+id+' video')
    const button1 = document.querySelector('#'+id+' #button-pins')
    const button2 = document.querySelector('#'+id+' #button-showlayout')
    button1.style.display = 'none'
    button2.style.display = 'none'
    myVideo.style.opacity = '1'
}
function getHours(){
    const divTime = document.getElementById('time-now')
    const d = new Date()
    const h = d.getHours()
    const m = d.getMinutes()
    const time = h + ' : ' + m
    divTime.innerHTML  += time
    console.log(time)
}

window.onpenFramesChat = (id) => {
    alert(id)
    document.getElementById("frame-users-chat").style.width = "300px"
    document.getElementById('div-bottom').style.width = "78%"
    document.getElementById("container").style.marginRight = "300px"
    document.getElementById('menu-top-right').style.height = "0"
}
window.closeFrameUsersChat = () => {
    document.getElementById("frame-users-chat").style.width = "0"
    document.getElementById('div-bottom').style.width = "100%"
    document.getElementById("container").style.marginRight = "0"
    document.getElementById('menu-top-right').style.height = "48px"
}


// event mic video
const button_mic= document.getElementById('button-mic')
const button_call= document.getElementById('button-call')
const button_videocam= document.getElementById('button-videocam')

button_mic.addEventListener('click', onClickMic)
button_call.addEventListener('click', onClickCall)
button_videocam.addEventListener('click', onClickVideoCam)

function onClickMic(){
    const icon_mic = document.getElementById('icon-mic')
    turnOffMic()
    if(icon_mic.name === 'mic-outline'){
        icon_mic.name = 'mic-off-outline'
        button_mic.style.background = 'red'
        button_mic.style.color = 'white'
        button_mic.style.borderColor = 'white'
        
    }
    else {
        icon_mic.name = 'mic-outline'  
        button_mic.style.background = 'white'
        button_mic.style.color = 'black'
        button_mic.style.borderColor = 'darkgray'
    }
}
function onClickCall(){
    
}
function onClickVideoCam(){
    const icon_videocam = document.getElementById('icon-videocam')
    turnOffVideo()
    if(icon_videocam.name === 'videocam-outline'){
        icon_videocam.name = 'videocam-off-outline'
        button_videocam.style.background = 'red'
        button_videocam.style.color = 'white'
        button_videocam.style.borderColor = 'white'
    }
    else {
        icon_videocam.name = 'videocam-outline'  
        button_videocam.style.background = 'white'
        button_videocam.style.color = 'black'
        button_videocam.style.borderColor = 'darkgray'
    }
    
}

function turnOffMic(){
    const track = localStream.getAudioTracks()[0]
    track.enabled = !track.enabled;
    socket.emit('turn off mic', socketidUser)
}
function turnOffVideo(){
    const track = localStream.getVideoTracks()[0]
    track.enabled = !track.enabled;
    socket.emit('turn off video', socketidUser);
}
// event mic video


// require 
const tabs = require('./js/tabs')
const click_outside = require('./js/click_outside')
const emoji = require('./js/emoji')
const chatmess = require('./js/chat')


const input_chat = document.getElementById('editTex-chat')
document.querySelectorAll(".tabEmotionPanel span").forEach(el=>{
    el.onclick = ()=>{
        let emoji = el.innerHTML.trim()
        let mess = input_chat.value
        input_chat.value = mess + emoji
        //editTex-chat get value ra rồi nối vào. oki :v
    }
})


