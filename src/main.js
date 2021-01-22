let Peer = require('simple-peer')
const tabs = require('./js/tabs')
const click_outside = require('./js/click_outside')
const emoji = require('./js/emoji')
const chatmess = require('./js/chat')
const animation_flex = require('./js/animation_flex_direction')
const socket = io()

const videoGrid = document.getElementById('video-grid')
let peers = {}
let people = {}
let localStream = null
let numberUserConnection = 0
var SOCKETID_USER = ''
let statusFrameChat = false
const configuration = {
    "iceServers":[
        {
        "urls":"stun:ss-turn2.xirsys.com"
        },
        {
        "username":"7ETtyeISctYstM4RPeJ5nWicOeKNFC7jDbzJZqQp135ujxeIeEiz_m708r7tN_8oAAAAAF_iLA5ubXRoYW5nbjIwMDA=",
        "url":"turn:ss-turn2.xirsys.com:80?transport=udp",
        "credential":"b30fa424-447a-11eb-a6ff-0242ac140004"
        },
        {
        "username":"7ETtyeISctYstM4RPeJ5nWicOeKNFC7jDbzJZqQp135ujxeIeEiz_m708r7tN_8oAAAAAF_iLA5ubXRoYW5nbjIwMDA=",
        "url":"turn:ss-turn2.xirsys.com:3478?transport=udp",
        "credential":"b30fa424-447a-11eb-a6ff-0242ac140004"
        },
        {
        "username":"7ETtyeISctYstM4RPeJ5nWicOeKNFC7jDbzJZqQp135ujxeIeEiz_m708r7tN_8oAAAAAF_iLA5ubXRoYW5nbjIwMDA=",
        "url":"turn:ss-turn2.xirsys.com:80?transport=tcp",
        "credential":"b30fa424-447a-11eb-a6ff-0242ac140004"
        },
        {
        "username":"7ETtyeISctYstM4RPeJ5nWicOeKNFC7jDbzJZqQp135ujxeIeEiz_m708r7tN_8oAAAAAF_iLA5ubXRoYW5nbjIwMDA=",
        "url":"turn:ss-turn2.xirsys.com:3478?transport=tcp",
        "credential":"b30fa424-447a-11eb-a6ff-0242ac140004"
        },
        {
        "username":"7ETtyeISctYstM4RPeJ5nWicOeKNFC7jDbzJZqQp135ujxeIeEiz_m708r7tN_8oAAAAAF_iLA5ubXRoYW5nbjIwMDA=",
        "url":"turns:ss-turn2.xirsys.com:443?transport=tcp",
        "credential":"b30fa424-447a-11eb-a6ff-0242ac140004"
        },
        {
        "username":"7ETtyeISctYstM4RPeJ5nWicOeKNFC7jDbzJZqQp135ujxeIeEiz_m708r7tN_8oAAAAAF_iLA5ubXRoYW5nbjIwMDA=",
        "url":"turns:ss-turn2.xirsys.com:5349?transport=tcp",
        "credential":"b30fa424-447a-11eb-a6ff-0242ac140004"
        }
    ] 
}

navigator.mediaDevices.getUserMedia({ video:true, audio: true })
.then(stream => {
    getHours()
    localStream = stream;
    getStream(localStream, "mytabvideo")
    
    socket.emit('join-room',ROOM_ID, USER_NAME)
    socket.emit('NewUser',ROOM_ID)
    socket.on('getsocketid', (id) => {
        SOCKETID_USER = id
        console.log("socketidUser", SOCKETID_USER);
        chatmess.sendMess(SOCKETID_USER, socket)
    })
    socket.on('user-name', (socket_id, username) => {
        addUser(socket_id, username)
    })
    socket.on('user-name-for-me', (socket_id, username) => {
        addUser(socket_id, username)
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
    peers[socket_id] = new Peer({ initiator: am_initiator, trickle: false, stream: localStream, config: configuration})

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
function addUser(socket_id, username) {
    people[socket_id] = username
    const divUser = document.querySelector('.tabPanel')
    let html =  '<div class="user">'+
                    '<div class="avata">'+
                    '<ion-icon name="person-circle-outline"></ion-icon>'+
                    '</div>'+
                    '<div class="user-name">'+people[socket_id]+'</div>'+
                    '<div class="user-ghim"><ion-icon name="eyedrop-outline"></ion-icon></div>'+
                    '<div class="user-volumn"><ion-icon name="volume-high-outline"></ion-icon></div>'+
                '</div>'
    if(divUser){
        divUser.innerHTML += html
    }
}
function getStream(stream, socket_id){
    const divNotGhim = document.querySelector('.videos .not-gim-layout')

    const mdiv = document.createElement('div')
    const myVideo = document.createElement('video')
    // button in video
    const button1 = document.createElement('div')
    const button2 = document.createElement('div')
    button1.classList.add('button-video')
    button1.classList.add('button-pins')
    button1.innerHTML += '<ion-icon name="eyedrop" class="button-pins-showlayout"></ion-icon>'
    button2.classList.add('button-video')
    button2.classList.add('button-showlayout')
    button2.innerHTML += '<ion-icon name="volume-high" class="button-pins-showlayout"></ion-icon>'
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
    if(divNotGhim != null){
        mdiv.classList.toggle('box')
        mdiv.classList.toggle('box-video')
        divNotGhim.append(mdiv)
    }else{
        videoGrid.append(mdiv)
    }
    
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
        if(statusFrameChat && number == 2)
            video[index].style.height = '60%'
        else if(number >= 5) {
            classBox[index].style.flex = '1 0 31%'
        }
        else if(number == 1){
            classBox[index].style.flex = '1 0 41%'
            video[index].style.height = '95%'
        } 
    }
}
function myOnClickVideo(id, type){
    const button1 = document.querySelector('#'+id+' .button-pins ion-icon')
    const button2 = document.querySelector('#'+id+' .button-showlayout ion-icon')
    if(type == "button1"){
        if(button1.name == 'eyedrop')
        {
            button1.name = 'backspace'
            setUpGhim(true, id)
        }
        else{
            button1.name = 'eyedrop'
            setUpGhim(false, id)
        }
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
function setUpGhim(checkGhim, id){
    const divVideo = document.querySelector('.videos')
    const divBox = document.getElementById(id)
    const divBoxButtonGhim= document.querySelector('#'+id+' .button-pins ion-icon')
    const divBoxAll = document.querySelectorAll('.videos .box')
    const divGhim = document.querySelector('.videos .gim-layout')
    const divNotGhim = document.querySelector('.videos .not-gim-layout')
    // ghim
    if(checkGhim){
        
        const myDivGhim = document.createElement('div')
        const myDivNotGhim = document.createElement('div')
        // kiểm tra video đã chọn ghim hay chưa
        console.log(divBox.className);
        if(divBox.className === "box-video"){
            const divGhimNew = document.querySelector('.videos .gim-layout .gim')
            const divGhimNewButtonGhim= document.querySelector('#'+divGhimNew.id+' .button-pins ion-icon')
            console.log(divGhim);
            divGhimNew.classList.toggle('gim')
            divGhimNew.classList.toggle('box-video')
            divGhimNewButtonGhim.name = 'eyedrop'
            divNotGhim.append(divGhimNew)
            //
            divBox.classList.toggle('gim')
            divBox.classList.toggle('box-video')
            divBoxButtonGhim.name = 'backspace'
            divGhim.append(divBox)
        }else{
            myDivGhim.classList.add('gim-layout')
            if(divGhim == null)
                divVideo.append(myDivGhim)
            myDivGhim.append(divBox)
            divBox.classList.toggle('box')
            divBox.classList.toggle('gim')
            //
            myDivNotGhim.classList.add('not-gim-layout')
            if(divNotGhim == null)
                divVideo.append(myDivNotGhim)
            if(divBoxAll != null)
                for (let index = 0; index < divBoxAll.length; index++) {
                    const element = divBoxAll[index];
                    if(element.id != id){
                        element.classList.toggle('box')
                        element.classList.toggle('box-video')
                        myDivNotGhim.append(element)
                    }
                }
        }
        if(statusFrameChat)
            animation_flex.AnimationFlex(statusFrameChat)
    }
    // bỏ ghim
    else{
        const myTabVideo = document.getElementById('mytabvideo') 
        const divGhimAll = document.querySelector('.videos .gim-layout .gim')
        const divNotGhimAll = document.querySelectorAll('.videos .not-gim-layout .box-video')
        console.log("cai lozz ma "+myTabVideo.className);
        if(myTabVideo.className === 'box-video')
            myTabVideo.classList.toggle('box-video')
        else if(myTabVideo.className === 'gim')
            myTabVideo.classList.toggle('gim')
        myTabVideo.classList.toggle('box')
        divVideo.append(myTabVideo) 
        console.log("cai lozz ma2 "+myTabVideo.className);
        //
        if(divGhimAll.id != 'mytabvideo'){
            divGhimAll.classList.toggle('box')
            divGhimAll.classList.toggle('gim')
            divVideo.append(divGhimAll) 
        }
        for (let index = 0; index < divNotGhimAll.length; index++) {
            const element = divNotGhimAll[index];
            if(element.id != 'mytabvideo'){
                element.classList.toggle('box')
                element.classList.toggle('box-video')
                divVideo.append(element)  
            }
            
        } 
        divGhim.remove()
        divNotGhim.remove()
    }
}
function mouseHoverVideo(id){
    
    const button1 = document.querySelector('#'+id+' .button-pins')
    const button2 = document.querySelector('#'+id+' .button-showlayout')
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
    const button1 = document.querySelector('#'+id+' .button-pins')
    const button2 = document.querySelector('#'+id+' .button-showlayout')
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
    const divGhim = document.querySelector('.videos .gim-layout')
    if(divGhim != null){
        animation_flex.AnimationFlex(true)
    }
    document.getElementById("frame-users-chat").style.width = "300px"
    document.getElementById('div-bottom').style.width = "78%"
    document.getElementById("container").style.marginRight = "300px"
    document.getElementById('menu-top-right').style.height = "0"
    const classBox = document.getElementsByClassName('box')
    const video = document.querySelectorAll('.box video')
    for (let index = 0; index < numberUserConnection; index++) {
        if(numberUserConnection == 2)
            video[index].style.height = '60%'
    }
    statusFrameChat = true
}
window.closeFrameUsersChat = () => {
    const divGhim = document.querySelector('.videos .gim-layout')
    if(divGhim != null){
        animation_flex.AnimationFlex(false)
    }
    document.getElementById("frame-users-chat").style.width = "0"
    document.getElementById('div-bottom').style.width = "100%"
    document.getElementById("container").style.marginRight = "0"
    document.getElementById('menu-top-right').style.height = "48px"
    const video = document.querySelectorAll('.box video')
    for (let index = 0; index < numberUserConnection; index++) {
        if(numberUserConnection == 2)
            video[index].style.height = '80%'
    }
    statusFrameChat = false
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
    socket.emit('turn off mic', SOCKETID_USER)
}
function turnOffVideo(){
    const track = localStream.getVideoTracks()[0]
    track.enabled = !track.enabled;
    socket.emit('turn off video', SOCKETID_USER);
}
// event mic video

const input_chat = document.getElementById('editTex-chat')
document.querySelectorAll(".tabEmotionPanel span").forEach(el=>{
    el.onclick = ()=>{
        let emoji = el.innerHTML.trim()
        let mess = input_chat.value
        input_chat.value = mess + emoji
        //editTex-chat get value ra rồi nối vào. oki :v
    }
})
// event modal user join
// Get the modal
const modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

socket.on('room-master', (namejoin, socket_master, socketid) => {
    if(socket_master === SOCKETID_USER){
        modal.style.display = "block";
        document.getElementById('user-lounge-join').innerHTML = namejoin
    }
    document.getElementById('btnAgree').addEventListener('click', function(){
        socket.emit('feedback-join-room', true, socketid)
        modal.style.display = "none";
    })
    document.getElementById('btnCancel').addEventListener('click', function(){
        socket.emit('feedback-join-room', false, socketid)
        modal.style.display = "none";
    })
})

