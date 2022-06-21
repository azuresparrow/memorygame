const gameContainer = document.getElementById("game");
const currentScore = document.querySelector("h2 span");
const difficultyContainer = document.getElementById("difficulty");
const winContainer = document.getElementById("win");

let outstandingMatch;
let matches = 0;
let totalClicks = 0;
let resolvingMatch = false;
let unsolvedMatches = 0;

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

function createCard(imgID, difficulty){
  console.log(`creating card ID ${imgID}`);
  const newWrapper = document.createElement("div");
  newWrapper.classList.add("cardWrapper");
  const newDiv = document.createElement("div");
  newDiv.classList.add("card");
  newDiv.dataset.imgID = imgID;
  newDiv.dataset.matched = false;
  const cardFront = document.createElement("div");
  cardFront.classList.add("front");
  cardFront.classList.add("face");
  const cardBack = document.createElement("div");
  cardBack.classList.add("back");
  cardBack.classList.add("face");
  cardFront.classList.add(difficulty);
  cardBack.classList.add(difficulty);
  const newGif = document.createElement("img");
  newGif.src = `gifs/${imgID}.gif`;
  cardBack.appendChild(newGif);
  newDiv.appendChild(cardFront);
  newDiv.appendChild(cardBack);
  newDiv.addEventListener("click", handleCardClick);
  newWrapper.appendChild(newDiv);
  gameContainer.append(newWrapper);
}

function startGame(difficulty) {
  let deck = []; // create a deck for the 15 unique gifs
  let uniqueGifs;
  if(difficulty=="easy"){
    uniqueGifs = 3;
  } else if(difficulty=="hard") {
    uniqueGifs = 10;
  } else {
    uniqueGifs = 6;
  }
  unsolvedMatches = uniqueGifs;
  for (let i = 0; i < 15; i++){
    deck.push(i);
  }
  shuffle(deck); // shuffle that array
  let cutDeck = deck.slice(0, uniqueGifs); //chop the front X elements off
  let copy = cutDeck;
  let completeDeck = cutDeck.concat(copy); // create a pair for each
  shuffle(completeDeck); //shuffle that new array
  console.log(completeDeck);
  for(let i = 0; i < completeDeck.length; i++){
    createCard(completeDeck[i], difficulty);
  }

}

function handleDifficultyClick(event){
  startGame(event.target.id)
  event.target.parentElement.classList.add("hidden");
}
difficultyContainer.addEventListener("click", handleDifficultyClick);

function handlePlayAgainClick(event){
  event.target.parentElement.classList.toggle("hidden");
  difficultyContainer.classList.toggle("hidden");
  totalClicks = 0;
  currentScore.innerHTML = 0;
  gameContainer.innerHTML = "";
}
winContainer.addEventListener("click",handlePlayAgainClick);

function handleCardClick(event) {
  //Input blocks
  if(event.target.parentElement === outstandingMatch) return;// ignore clicking the same card twice
  if(event.target.parentElement.dataset.matched == "true") return; // ignore clicks on cards that are already matched
  if(resolvingMatch) return; //ignore new inputs while waiting to flip back cards

  totalClicks++; //update score if valid click
  currentScore.innerHTML = totalClicks;

  event.target.parentElement.classList.toggle("facedown");
  if(!outstandingMatch){ //first card clicked
    outstandingMatch = event.target.parentElement; //save this target to use on the next click.
  } else { //second card clicked
    if(outstandingMatch.dataset.imgID == event.target.parentElement.dataset.imgID){
      outstandingMatch.dataset.matched = true;
      event.target.dataset.matched = true;
      outstandingMatch = null; // reset outstanding match
      if(--unsolvedMatches == 0){
        winContainer.classList.toggle("hidden");
      }
    } else { // Cards did not match
      resolvingMatch = true;
      setTimeout(function() {
        event.target.parentElement.classList.toggle("facedown");
        outstandingMatch.classList.toggle("facedown");
        outstandingMatch = null; //reset outstanding match
        resolvingMatch = false;
      }, 1500);
    }
  }
}
// when the DOM loads

/* */