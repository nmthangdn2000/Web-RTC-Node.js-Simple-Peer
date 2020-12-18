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
const input_name = document.querySelector('input_text');
input_name.focus()
input_name.blur() 