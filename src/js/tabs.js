const tabContainer = document.querySelectorAll('.tabs .tabContainer div')
const tabPanel = document.querySelectorAll('.tabs .tabPanel')
const tabPeople = document.getElementById('tabPeople')
const tabChat = document.getElementById('tabChat')

tabPeople.addEventListener('click', () => {onClickTab(0)})
tabChat.addEventListener('click', () => {onClickTab(1)})
function onClickTab(id){
    tabContainer.forEach((node)=>{
        node.style.background = 'white'
    })
    tabContainer[id].style.background = '#d4fc79'
    tabPanel.forEach((node) => {
        console.log(node);
        node.style.display = 'none'
    })
    tabPanel[id].style.display = 'block'
}

module.exports = onClickTab()