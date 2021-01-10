const container = document.querySelector(".image-container")
const startButton = document.querySelector(".start-button")
const gameText = document.querySelector(".game-text")
const playTime = document.querySelector(".play-time")
const content = document.querySelector(".container")
const randomButton = document.querySelector(".random-button")
const imgIndex = document.querySelector(".img-index")
const file = document.querySelector(".file-upload-input")
const hintButton = document.querySelector(".hint-button")
const hintHidden = document.querySelector(".hidden-button")
const hintWhite = document.querySelector(".hint-white")
const hintBlack = document.querySelector(".hint-black")


const tileCount = 16;

let tiles = [];
const dragged={
    el: null,
    class: null,
    index: null,

}
let isPlaying = false;
let timeInterval = null;
let time = 0;


//function


function checkStatus(){
    const currentList = [...container.children];
    const unMatchedList = currentList.filter((child,index) => Number(child.getAttribute("data-index")) !== index)
    if( unMatchedList.length ===0){
        gameText.style.display = "block";
        isPlaying = false;
        clearInterval(timeInterval)
    }
}

function reSet(){
    
    time = 0;
    container.innerHTML = "";
    gameText.style.display = "none";
    hintButton.style.display = "none";
    hintWhite.style.display = "none";
    hintBlack.style.display = "none";
    hintHidden.style.display = "none";
    clearInterval(timeInterval)
}

function createImageTiles(url){
    reSet()
    playTime.innerText = time;
    const tempArray = [];
    
    let x =0;
    let y =0;
    let indexNum = 0;
    
    Array(tileCount).fill().forEach((_ , i )=>{
        indexNum = i + 1;
        const li = document.createElement("li");
        li.setAttribute('data-index',i);
        li.setAttribute('draggable', 'true');
        li.setAttribute('id','li-image');
        li.classList.add(`list${i}`);
        li.style.background = `url("${url}")`;
        li.style.backgroundPositionX = `${x}px`;
        li.style.backgroundPositionY = `${y}px`;
        li.style.backgroundSize ="400px 400px";
        li.style.position="relative";
        li.textContent = indexNum;
        li.style.textAlign = "left";
        li.style.color = "#FFFFFF"
        li.style.fontSize ="0"
        // console.log(`${x} , ${y}`)
        x = x - 100;
        if(x === - 400){
            x = 0;
            y = y - 100;
        }        
        tempArray.push(li);
        
    })

    tiles = tempArray;
    tiles.forEach(tile=>container.appendChild(tile))

    
    content.style.display = "flex";
    
}


function setGame(){
    reSet()
    isPlaying = true;
    shuffle(tiles).forEach(tile=>container.appendChild(tile))
    timeInterval = setInterval(()=>{
        playTime.innerText = time;
        time++;
    },1000)

    setTimeout(()=>{
            hintButton.style.display = "block";
            hintHidden.style.display = "block";
            hintWhite.style.display = "block";
            hintBlack.style.display = "block";
    },5000)
}

function shuffle(array){
    let index = array.length -1 ;
    while(index > 0){
        const randomIndex = Math.floor(Math.random()*(index+1));
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]]
        index--;
    }
    return array;
}



//events
container.addEventListener('dragstart', e => {
    console.log(isPlaying)
    if(!isPlaying) return;
    const obj = e.target;
    dragged.el  = obj;
    dragged.class = e.className;
    dragged.index = [...obj.parentNode.children].indexOf(obj);
})

container.addEventListener('dragover', e => {
    e.preventDefault()
    
})

container.addEventListener('drop', e => {
    if(!isPlaying) return;
    const obj = e.target;

    if(obj.className !== dragged.class){
        let originPlace;
        let isLast = false;
    
        if(dragged.el.nextSibling){
            originPlace = dragged.el.nextSibling
        }else{
            originPlace = dragged.el.previousSibling
            inLast = true;
        }
        const droppedIndex = [...obj.parentNode.children].indexOf(obj);
        dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el)

        isLast ? originPlace.after(obj) : originPlace.before(obj)
    }

    checkStatus()
})

startButton.addEventListener('click', () =>{
    setGame()
})

randomButton.addEventListener('click', () =>{
    let num =  Math.floor(Math.random()*100);
    let url = `https://placeimg.com/400/400/${num}`;

    createImageTiles(url)
})


hintButton.addEventListener('click', () =>{
    console.log("aa")
    tiles.forEach(tile=>tile.style.fontSize = "1rem")
} )

hintHidden.addEventListener('click', () =>{
    tiles.forEach(tile=>tile.style.fontSize = "0")
})

hintWhite.addEventListener('click',() => {
    tiles.forEach(tile=>tile.style.color = "white")
})

hintBlack.addEventListener('click',() => {
    tiles.forEach(tile=>tile.style.color = "black")
})
// uploadButton.addEventListener('click', () =>{
//     createImageTiles()
// })



function readURL(input) {
    if (input.files && input.files[0]) {
  
      var reader = new FileReader();
      reader.onload = function(e) {
          
        createImageTiles(e.target.result)
      };
  
      reader.readAsDataURL(input.files[0]);
      file.style.width = "400px";
      file.style.height = "400px"
      
    } else {
   
    }
  }

//Image Upload
