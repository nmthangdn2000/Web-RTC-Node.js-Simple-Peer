 const click_outside = document.addEventListener("click", (evt) => {
    const floating_emotion = document.querySelector('.floating-emoiton-chat')
    const button_emotion = document.querySelector('.button-emotion-chat')
    const targetElement = evt.target.parentNode; // clicked element

    console.log(targetElement);
    if(targetElement === button_emotion){
        console.log('true');
        floating_emotion.classList.toggle('floating-emoiton-chat-block')
    }else if (targetElement === floating_emotion || targetElement === document.querySelector('.tabEmotionPanel')) return
    else{
        console.log('false');
        if(floating_emotion.classList.contains('floating-emoiton-chat-block'))
        floating_emotion.classList.remove('floating-emoiton-chat-block')
    }
})

module.exports = click_outside