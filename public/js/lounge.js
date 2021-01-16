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
// box search
document.getElementById('box-search').addEventListener('keyup', function(e) {
    e.preventDefault();
    searchRoom()
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
    const body_table = document.querySelector('.content-table tbody')
    const loader = document.querySelector('.loader')
    loader.style.display = 'block'
    body_table.style.display = 'none'

    body_table.innerHTML = ''
    modal_search.style.display = "block";
    axios({
        method: 'get',
        url: 'http://localhost:3000/room_id',
    })
    .then(function (response) {
        let i = 0
        response.data.forEach(element => {
            i++
            let html = '<tr data-room="'+element.room_id+'">'+
                        '<td width="5%">'+i+'</td>'+
                        '<td width="20%">'+element.room_name+'</td>'+
                        '<td width="30%">'+element.room_id+'</td>'+
                        '<td width="10%">'+element.status+'</td>'+
                        '<td width="15%">'+element.room_mode+'</td>'+
                        '<td width="10%">2</td>'+
                    '</tr>'
            body_table.insertAdjacentHTML( 'beforeend', html)
        })
        setTimeout(function(){
            loader.style.display = 'none'
            body_table.style.display = 'block'
        }, 2000)
        const rows = document.querySelectorAll('.content-table tbody tr[data-room]')
        rows.forEach(element => {
            element.addEventListener('click', () => {
                document.getElementById('froom').value = element.getAttribute('data-room')
                modal_search.style.display = 'none'
            })
        });
    })
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
function searchRoom(){
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("box-search");
    filter = input.value.toUpperCase();
    table = document.getElementById("table-room");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
        }       
    }
}