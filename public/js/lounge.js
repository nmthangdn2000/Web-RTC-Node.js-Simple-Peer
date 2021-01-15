const socket = io()

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
.then(stream => {
    const video = document.getElementById('video')
    video.muted = true
    video.srcObject = stream
    video.onloadeddata = () => {
        video.play()
    }
})
.catch(err => {
    console.log("", err);
})
// button submit
const btnSubmit = document.getElementById('button-submit')
btnSubmit.onsubmit = function (e){
    e.preventDefault()
    axios({
        method: 'post',
        url: 'http://localhost:3000/room_id',
        data: {
            name: btnSubmit.name.value,
            roomid: btnSubmit.roomid.value
        }
    })
    .then(function (response) {
        console.log(response.data);
        if(typeof response.data === "object"){
            let i = 0
            response.data.forEach(element => {
                i = i +1
                const divBoxAlert = document.querySelector('.box-toast-alert')
                let htmlAlert = ' <div class="alert hide" id="alert'+ i +'">'+
                                    '<span class="fas fa-exclamation-circle"></span>'+
                                    '<span class="msg">'+element+'</span>'+
                                    '<div class="close-btn-alert">'+
                                    '<span class="fas fa-times"></span>'+
                                    '</div>'+
                                '</div>'
                divBoxAlert.insertAdjacentHTML( 'beforeend', htmlAlert )
                const boxAlert = document.getElementById('alert'+ i)
                boxAlert.classList.add("show");
                boxAlert.classList.remove("hide");
                boxAlert.classList.add("showAlert");
                setTimeout(function(){
                    boxAlert.classList.remove("show");
                    boxAlert.classList.add("hide");
                    divBoxAlert.innerHTML = ''
                },5000);
                const btnCloseAlert = document.querySelector('#alert'+i+' .close-btn-alert')
                btnCloseAlert.onclick = function(){
                    btnCloseAlert.classList.remove("show");
                    btnCloseAlert.classList.add("hide");
                }
            })
        }else{
            document.forms["formlonge"].submit();
        }
    })
}
//


// button submit
// create room id
const btnCreateId = document.getElementById('create-room')
if(btnCreateId)
    btnCreateId.onclick = function () {
        axios({
            method: 'get',
            url: 'http://localhost:3000/get_room_id',
        })
        .then(function (response) {
            document.getElementById('froom').value = response.data
        })
    }
// create room id

// modal đăng nhập đăng ký ----------------------------------------------------------------------------------
// Get the modal
const modal = document.getElementById("myModal");

// Get the button that opens the modal
const btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

if(btn){
    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
    }
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    
    // When the user clicks anywhere outside of the modal, close it
}

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const modal_container = document.getElementById('modal-container');

signUpButton.addEventListener('click', () => {
    modal_container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    modal_container.classList.remove("right-panel-active");
});


// modal search room
const modal_search = document.getElementById("myModal-search");

// Get the button that opens the modal
const btn_search = document.getElementById("search-room");

// Get the <span> element that closes the modal
const span_search = document.getElementById('close-search')

// When the user clicks the button, open the modal 
btn_search.onclick = function() {
    modal_search.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span_search.onclick = function() {
    modal_search.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal_search) {
    modal_search.style.display = "none";
  }
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// modal search room
// modal đăng nhập đăng ký ----------------------------------------------------------------------------------