let playerHand;
let deck;
let turn = 0;
getCards().then((cards) => {
	playerHand = populatePlayersHand(cards);
	deck = cards;
	if(turn){
		setTimeout(()=>{		CPUTurn();
}, 1000)
	}
})
let CPUHand = populateCPUHand();
let boardElements = [];
let avaliableIndeces = [0,1,2,3,4,5,6,7,8];
let RPSArr = ["rock", "paper", "scissor"];
let $turn = document.querySelector("#turn");
let $score = document.querySelector("#score");
let $board = document.querySelector(".board");
let $modalContent = document.querySelector("#RPSGame");
let $RPSGameDisplay = document.querySelector(".RPSGameDisplay");
let $RPSGameMessageDisplay = document.querySelector(".resultDisplay");
let $resultMessage = document.querySelector("#RPSResult");
let $playerAside = document.querySelector(".playerCards");
let $loadingModal = document.querySelector(".loading");
let $CPUAside = document.querySelector(".CPUCards");

for(i of "123456789"){
	let $div = document.createElement("div");
	$div.setAttribute("ondrop", "drop(event)");
	$div.setAttribute("ondragover", "allowDrop(event)");
	$div.setAttribute("style", "width: 100%; height: 100%;");
	boardElements.push($div);
	$board.appendChild($div);
}

for(i of "123"){
	let $RPSCard = document.createElement("img");
	$RPSCard.id = i;
	$RPSCard.addEventListener("click", () =>{
		let playerChoice = RPSArr[Math.floor(Math.random() * 3)]
		let CPUChoice = RPSArr[Math.floor(Math.random() * 3)]
		let $sibling = (Math.floor(Math.random() * 101) % 2) === 1;
		
		if($RPSCard.id === "1"){
			$sibling = $sibling? $RPSCard.nextSibling: $RPSCard.nextSibling.nextSibling
		}else if($RPSCard.id === "2"){
			$sibling = $sibling? $RPSCard.previousSibling : $RPSCard.nextSibling
		}else{
			$sibling = $sibling? $RPSCard.previousSibling.previousSibling : $RPSCard.previousSibling;
		}
		
		$RPSCard.setAttribute("src","assets/cards/"+playerChoice+".png");
		$sibling.setAttribute("src","assets/cards/"+CPUChoice+".png");
		
		let message = null, result;
		if(playerChoice === CPUChoice){
			message = "DRAW"
			result = 0;
		}else if(playerChoice === "rock"){
			result = CPUChoice === "scissor"? 1 : -1;
		}else if(playerChoice === "paper"){
			result = CPUChoice === "rock"? 1 : -1; 
		}else{
			result = CPUChoice === "paper"? 1 : -1; 
		}
		if(!message){
			message = result === 1? "You Win!!!\nYou start first" : "You Lost!!!\nCPU start first";
		}

		$RPSGameMessageDisplay.style.display = "inherit"
		$resultMessage.innerText = message
		message = null;
		setTimeout(() => {
			if(result){
				turn = result === 1? !turn : turn
				switchTurn();
				$score.innerText = "Score: 0 / 0";
				$RPSGameDisplay.style.display = "none";
			}
			$RPSGameMessageDisplay.style.display = "none"
			$RPSCard.setAttribute("src","assets/cards/cardBack.jpg");
			$sibling.setAttribute("src","assets/cards/cardBack.jpg");
		}, 1200);
	})
	$RPSCard.setAttribute("src", "assets/cards/cardBack.jpg");
	if(i === "1"){
		$RPSCard.setAttribute("style", "grid-column:span 2;");
	}else{
		$RPSCard.setAttribute("style", "grid-row-start:3;");
	}
	$modalContent.appendChild($RPSCard)
}
function populatePlayersHand(cards){
	let hand = []; 
	$loadingModal.remove();
	for(i of "12345"){
		let $img = document.querySelector("#p"+i); 
		hand.push(Math.floor(Math.random() * 272));
		$img.setAttribute("src", cards[hand[Number(i)-1]].image);
	}
	return hand;
}
function populateCPUHand(){
	let hand = [];
	for(i = 0; i < 5; ++i){
		hand.push(Math.floor(Math.random() * 272));
	}
	return hand;
}
function switchTurn() {
	$turn.innerText = turn ? "Player Turn": "CPU Turn";
	turn = !turn
	$resultMessage.innerText = $turn.innerText
	$RPSGameMessageDisplay.style.display = "inherit";
	setTimeout(() => {
		$RPSGameMessageDisplay.style.display = "none";
	},1000)
	return turn;
}
function gameLogic(placedCard){
	let cardIndex = boardElements.indexOf(placedCard);
	avaliableIndeces.splice(avaliableIndeces.indexOf(cardIndex), 1);

	let locateHorizontalPosition = (cardIndex) % 3;
	let locateVerticalPosition = Math.floor((cardIndex) / 3);
	let upCard = validateUpDown(cardIndex - 3);
	let downCard = validateUpDown(cardIndex + 3);
	let leftCard =  Math.floor((cardIndex-1) / 3) === locateVerticalPosition? cardIndex-1: -1;;
	let rightCard = Math.floor((cardIndex+1) / 3) === locateVerticalPosition? cardIndex+1: -1;

	attckingLogic(placedCard, upCard, "top", "bottom");
	attckingLogic(placedCard, downCard, "bottom", "top");
	attckingLogic(placedCard, leftCard, "left", "right");
	attckingLogic(placedCard, rightCard, "right", "left");

	let playerScore = 0;
	let CPUScore = 0;

	for(slot of boardElements){
		if(!slot.firstChild){
			continue;
		}else if(slot.firstChild.classList[0] === "Player"){
			++playerScore;
		}else if(slot.firstChild.classList[0] === "CPU"){
			++CPUScore;
		}
	}
	$score.innerText = "Score: "+playerScore+" / "+CPUScore;
	if(avaliableIndeces.length === 0 || (avaliableIndeces.length === 1 && !turn)){
		$resultMessage.innerText =  (playerScore === CPUScore? "TIE" : playerScore > CPUScore? "YOU WIN" : "YOU LOSE") + "\nTo play again, please refresh the page...";
		setTimeout(()=>{
			$RPSGameMessageDisplay.style.display ="inherit";
		}, 1000)
	}
}
function validateUpDown(value) {
	if (value > 8 || value < 0){
		return -1;
	}
	return value;
}

function attckingLogic(placedCard, surroundingCardIndex, attackingPosition, defendingPosition ) {
	let defenderCard = boardElements[surroundingCardIndex];
	let defendingValueAtPosition, attactingValueAtPosition;
	if(surroundingCardIndex === -1 || !defenderCard.firstChild || defenderCard.firstChild.classList[0] === placedCard.firstChild.classList[0]){
		return;
	}
	console.log("attacking at", surroundingCardIndex, defenderCard)


	if(!turn){
		attactingValueAtPosition = deck[playerHand[Number(placedCard.firstChild.id[1])-1].toString()].stats.numeric[attackingPosition];
		if(defenderCard.firstChild.id[0] === "c"){
			defendingValueAtPosition = deck[CPUHand[Number(defenderCard.firstChild.id[1])-1].toString()].stats.numeric[defendingPosition];
		}else{
			defendingValueAtPosition = deck[playerHand[Number(defenderCard.firstChild.id[1])-1].toString()].stats.numeric[defendingPosition];
		}

	}else{
		attactingValueAtPosition = deck[CPUHand[Number(placedCard.firstChild.id[1])-1].toString()].stats.numeric[attackingPosition];
		if(defenderCard.firstChild.id[0] === "c"){
			defendingValueAtPosition = deck[CPUHand[Number(defenderCard.firstChild.id[1])-1].toString()].stats.numeric[defendingPosition];
		}else{
			defendingValueAtPosition = deck[playerHand[Number(defenderCard.firstChild.id[1])-1].toString()].stats.numeric[defendingPosition];
		}


	}

	if(attactingValueAtPosition > defendingValueAtPosition){
		defenderCard.firstChild.classList.remove(defenderCard.firstChild.classList[0]);
		defenderCard.firstChild.classList.add(placedCard.firstChild.classList[0]);
	}	
}

function CPUTurn(){

	if($score.innerText === "Score: 0 / 0"){
		let placeAt = Math.floor(Math.random() * 9);
		CPUCardTransfer(placeAt);
		return 0;
	}
	let randomPosition = avaliableIndeces[Math.floor(Math.random() * avaliableIndeces.length)];
	setTimeout(() => {
		CPUCardTransfer(randomPosition);		
	},1000);
}
function CPUCardTransfer(index){
	let $card = $CPUAside.firstElementChild;
	$CPUAside.firstChild.remove();
	$card.setAttribute("src", deck[CPUHand[Number($card.id[1]) - 1]].image);
	boardElements[index].appendChild($card);
	boardElements[index].removeAttribute("style");
	gameLogic(boardElements[index]);
	if(avaliableIndeces.length){
		switchTurn();
	}
}
function allowDrop(ev) {
		ev.preventDefault();
}

function drag(ev) {
		ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");
		if(data.search(/^p\d$/) === -1){
			return;
		}
		let card = document.getElementById(data);
		card.removeAttribute("draggable")
		card.removeAttribute("ondragstart")
		ev.target.appendChild(document.getElementById(data));
		ev.target.removeAttribute("style");

		gameLogic(ev.target);
		if(avaliableIndeces.length && switchTurn()){
			CPUTurn();
		}
}
async function getCards(){
	const response = await fetch("https://triad.raelys.com/api/cards");
	const cardsObjects = await response.json();
	return cardsObjects.results
}
