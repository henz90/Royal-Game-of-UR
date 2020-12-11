console.log("RGoU2.js has loaded");

/* Created by: 
Norman Fong
Massoumeh Mahaei
Zarmeen Fancy
Henry Zakay
*/

window.addEventListener('load', function (e){
    initializeBoard();
    initiateGame();
    }); //onload event listener
//----- DO NOT TOUCH ABOVE ----//
document.getElementById("restart").addEventListener("click",show_dialog);
//VARIABLES
var blackPcs = 3; //black pieces left on board
var whitePcs = 3; //white pieces left on board
var counter = 1; // Turn Checker
var whiteRoll = document.getElementById("btnWhiteRoll");
var blackRoll = document.getElementById("btnBlackRoll");
var sum = 0; // Roll result
var turn = null;
var blackStart = 3; // Amount of pieces in black starting tile
var whiteStart = 3; // Amount of pieces in white starting tile
var whoTurn; // letter of who's turn. Used for IDs
var reverseTurn; // letter of (reverse who's turn). Used for IDs.
var tiles = document.getElementsByClassName("tile"); //the whole board
var turnColor;
var roll = document.getElementById('roll');

/**
 * Checks who's turn it is
 * @returns {Boolean} true (White) or false (Black).
 */
function turnCheck() {
    if (counter % 2 == 0) {
        //White's turn disables black roll button and enables white roll button
        blackRoll.disabled = true;
        whiteRoll.disabled = false;
        whoTurn = "w";
        reverseTurn = "b";
        turnColor = "White";
        return true;
    } else {
        //Black's turn disables white roll button and enables black roll button
        whiteRoll.disabled = true;
        blackRoll.disabled = false;
        whoTurn = "b";
        reverseTurn = "w";
        turnColor = "Black";
        return false;
    }
}

/**
* Generates and sums four random int between 0 and 1
*/
function rollDice() {
    //disables rolling while opperating
    whiteRoll.disabled = true;
    blackRoll.disabled = true;
    roll.innerHTML = "";  //Clears the roll display
    //sets sum (which is the roll result) to 0
    sum = 0;
    //Gets our random number
    for (let i = 0; i < 4; i++) {
        var coin = Math.floor(Math.random()*2);
        sum += coin;   //Adds it to the sum
    }
    //Update roll display with the new number
    displayRoll = document.createTextNode("ROLL: " + sum);
    roll.appendChild(displayRoll);
    roll.appendChild(document.createElement("br"));
    var turnText = document.createTextNode(turnColor + "'s move");
    roll.append(turnText);
    //If they roll a zero they lose their turn
}
/**
 * calls all related functions to ending a turn
 */
function turnEnd() {
    counter++;
    roll.innerHTML = "ROLL: ";
    sum = 0;
    resetTiles();
    updateBoard();
    finishTileCount();
    displayTurn(turnCheck());
    initiateGame();
    roll.appendChild(document.createElement("br"));
    var turnText = document.createTextNode(turnColor + "'s turn");
    roll.append(turnText);
}

/**
* Checks which turn it is, and allows the dice to roll.
*/
function initiateGame() {
       // Assign a number to the start and end locations.
        turn = turnCheck();
    if (turn) {
        //enables white roll
        whiteRoll.disabled = false;
    } else {
        //enables black roll
        blackRoll.disabled = false;
    }
}

/**
 * resets all tiles to a black border
 */
function resetTiles() {
    for (let j = 0; j < tiles.length; j++) {
        var resetTile = tiles[j];
        resetTile.style.borderColor = "black";
        resetTile.classList.remove("clicked");
    }
}

/**
 * Initializes the board to have the event listeners needed to play the game.
 */
function initializeBoard() {
    whiteRoll.addEventListener("click", function(){ 
        //dice roll, verfication if moves are possible
        rollDice();
        canMove();
    });
    blackRoll.addEventListener("click", function(){
        //dice roll, verfication if moves are possible
        rollDice();
        canMove();
    });
    for (var i = 0; i < tiles.length ; i++) {
        var tile = tiles[i];
        tile.addEventListener("mouseover", function(e){ //on mouseover of piece, turn green.
            e.preventDefault;
            if (this.classList.contains(whoTurn) && sum > 0) {
                this.style.borderColor = "green";
            }
        })
        tile.addEventListener("mouseleave", function(e){ //on mouseleave of piece, return to black.
            e.preventDefault;
            if (this.style.borderColor == "green" && !this.classList.contains("clicked")) {
                this.style.borderColor = "black";
            }
        })
        tile.addEventListener("mouseup", function(e){
            e.preventDefault;
            if (sum > 0 ) {
                if (this.style.borderColor == "green" && this.classList.contains("clicked")) { 
                    //removing clicked status
                    this.classList.remove("clicked");
                    var location = this.id;
                    var destinationID = getIdDestination(location);
                    for (var j = 0; j < tiles.length; j++) {
                        if (tiles[j].id.indexOf(destinationID) > -1) { 
                            //validation to ensure ID exists in board
                            var destination = document.getElementById(destinationID);
                            destination.style.borderColor = "black";
                        }
                    }
                } else
                if (this.style.borderColor == "green" && !this.classList.contains("clicked")) {
                    this.className += " clicked"; //adding class "clicked"
                    var location = this.id;
                    var destinationID = getIdDestination(location);
                    for (var j = 0; j < tiles.length; j++) {
                        if (tiles[j].id.indexOf(destinationID) > -1) { 
                            //validation to ensure ID exists in board
                            var destination = document.getElementById(destinationID);
                            destination.style.borderColor = "red";
                        }
                    }
                }
                if (this.style.borderColor == "red" && this.classList.contains("double")) { 
                    // get another turn. 
                    // also happens before eating piece so protected should be fine.
                    this.className += " " + whoTurn;
                    removeTile(this.id);
                    counter++;
                    turnEnd();
                } else if (this.style.borderColor == "red" && this.classList.contains(reverseTurn)) {
                    this.className += " " + whoTurn; //adds piece to tile.
                    removeTile(this.id)
                    eatingPiece(this.id);
                    turnEnd();
                }
                else if (this.style.borderColor == "red"){
                    this.className += " " + whoTurn;
                    removeTile(this.id)
                    turnEnd();
                }
            }
        })
    }
}

/**
 * when black wins
 */
function blackWins() {
    whiteRoll.disabled = true;
    blackRoll.disabled = true;
    alert("Black Wins!");
    location.href ="../HTML/RGoU.html";
}
/**
 * when white wins
 */
function whiteWins() {
    whiteRoll.disabled = true;
    blackRoll.disabled = true;
    alert("White Wins!");
    location.href ="../HTML/RGoU.html";
}

/**
 * updating the board to reflect piece changes.
 */
function updateBoard() {
    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i].classList.contains("double") && tiles[i].classList.contains("b")) {
            tiles[i].src = "../IMAGES/bTile1.jpg";
        } else
        if (tiles[i].classList.contains("double") && tiles[i].classList.contains("w")) {
            tiles[i].src = "../IMAGES/wTile1.jpg";
        } else
        if (tiles[i].classList.contains("double")){
            tiles[i].src = "../IMAGES/tile1.jpg";
        }

        if (blackStart == 0 && tiles[i].id == "00b") {
            tiles[i].src = "../IMAGES/Tile3.jpg";
        }
        if (whiteStart == 0 && tiles[i].id == "00w") {
            tiles[i].src = "../IMAGES/Tile3.jpg";
        }
        if (tiles[i].id == "00b" && blackStart!= 0 ) {
            tiles[i].src = "../IMAGES/bPiece.png";
        }
        if (tiles[i].id == "00w" && whiteStart!= 0 ) {
            tiles[i].src = "../IMAGES/wPiece.png";
        }

        if (tiles[i].classList.contains("normal") && tiles[i].classList.contains("b") ) {
            tiles[i].src = "../IMAGES/bTile2.jpg";
        } else
        if (tiles[i].classList.contains("normal") && tiles[i].classList.contains("w") ) {
            tiles[i].src = "../IMAGES/wTile2.jpg";
        } else
        if (tiles[i].classList.contains("normal")) {
            tiles[i].src = "../IMAGES/tile2.jpg";
        }
    }
}

/** 
 * takes the id of the tile being selected and returns the id of the tile that can be moved to.
 * adds sum to id
 * @param {*} idAsInt id of the tile being selected
 * @returns id of the tile to be moved to
 */
function getIdDestination(id) {
    idAsInt = parseInt(id);
    var total = idAsInt + sum;
    var newId;
    if (total > 4 && total < 13) { //middle row
        if (total < 10 ) { //if id needs 0s
            if (turnCheck()) {
                newId = ("0" + total + reverseTurn + "_" + "0" + total + whoTurn);
            } else {
                newId= ("0" + total + whoTurn + "_" + "0" + total + reverseTurn);
            } 
        } else {
            if (turnCheck()) {
                newId = (total + reverseTurn + "_" + total + whoTurn);
            } else {
                newId = (total + whoTurn + "_" + total + reverseTurn);
            }
        }   
    } else {
        if (total < 10) {
            newId = ("0" + total + whoTurn);
        } else {
            newId = (total + whoTurn);
        }
    }
    return newId;
}

/**
 * takes the id of the tile being selected and returns the id of the tile to be removed.
 * removes sum from id
 * @param {*} idAsInt id of the tile being selected
 * @returns id of the tile to be removed 
 */
function getRemovedTileId(tileID) {
    var idAsInt = parseInt(tileID);
    var difference = idAsInt - sum;
    if (difference > 4 && difference < 13) { //middle row
        if (difference < 10 ) { //if id needs 0s
            if (turnCheck()) {
            return  ("0" + difference + reverseTurn + "_" + "0" + difference + whoTurn);
            } else {
                return  ("0" + difference + whoTurn + "_" + "0" + difference + reverseTurn);
            } 
        }
            else {
                if (turnCheck()) {
                    return  (difference + reverseTurn + "_" + difference + whoTurn);
                } else {
                    return  (difference + whoTurn + "_" + difference + reverseTurn);
                }
            }
    } else {
        if (difference < 10) {
            return ("0" + difference + whoTurn)
        } else {
            return (difference + whoTurn);
        }
    }
}
/**
 * checks board for pieces on ending spots. reduces counter if yes.
 * Ends game if either piece is 0.
 */
function finishTileCount() {
    if (document.getElementById("15b").classList.contains("b")){
        document.getElementById("15b").classList.remove("b");
        blackPcs--;
    }
    if (document.getElementById("15w").classList.contains("w")){
        document.getElementById("15w").classList.remove("w");
        whitePcs--;
    }
    if (blackPcs == 0) {
        blackWins();
    }
    if ( whitePcs == 0) {
    whiteWins();
    }
}

/**
 * Removes the piece that is being moved.
 * @param {string} tileID string of ID of tile that is being moved to.
 */
function removeTile(tileID){
    var idAsInt = (parseInt(tileID));
    var tileToRemove = document.getElementById(getRemovedTileId(idAsInt))
    if (tileToRemove.classList.contains("start")) {
        if (blackStart == 1) { //if last piece from start
            tileToRemove.classList.remove("b"); 
        } else if (whiteStart == 1) {
            tileToRemove.classList.remove("w");
        }
        if (whoTurn == "b") {
            blackStart--;
        } else {
            whiteStart--;
        }
    } else {
        tileToRemove.classList.remove(whoTurn); //removing old piece
    }
}

/**
 * removes piece from the tileID provided and returns the piece to the start.
 * @param {string} tileID string of ID of tile to remove opposing piece from.
 */
function eatingPiece(tileID){
    if (whoTurn == "w") {
        document.getElementById(tileID).classList.remove("b");
        blackStart++;
        if (blackStart == 1) {
            document.getElementById("00b").className += " b";
        }
    } else {
        document.getElementById(tileID).classList.remove("w");
        whiteStart++;
        if (whiteStart == 1) {
            document.getElementById("00w").className += " w";
        }
    }
}

/**
 * verifies if any moves are possible
 * accounts for 0 and no moves are available near the end of the game
 * If there are none, the turn is ended immediately.
 */
function canMove() {
    var moveArray = []
    var playerTiles = document.getElementsByClassName(whoTurn);
    var board = document.getElementsByTagName("img");
    for (var i = 0; i < playerTiles.length; i++) {
        var loc = parseInt(playerTiles[i].id);
        var moveOption =  loc + sum;
        var moveOptionId = moveOption + whoTurn;
        if (moveOption < 10) {
            moveOptionId = "0" + moveOptionId
        }
        for (var j = 0; j < board.length; j++) {
            if (board[j].id.indexOf(moveOptionId) > -1) {
                if (board[j].classList.contains(whoTurn)) {
                    continue;
                }
                if (moveOption < 10) {
                    var option = "0" + parseInt(board[j].id) + whoTurn;
                    moveArray.push(option);
                } else {
                    moveArray.push(parseInt(board[j].id) + whoTurn);
                }
            }
        }
    } if (moveArray[0]== null) { 
        roll.innerHTML = "";
        var displayRoll = document.createTextNode("ROLL: " + sum);
        roll.append(displayRoll);
        roll.appendChild(document.createElement("br"));
        var noMove = document.createTextNode("No possible moves");
        roll.append(noMove);
        setTimeout(turnEnd, 2000);
    }
}

// Call function when show dialog btn is clicked


    



var overlayme = document.getElementById("dialog-container");
function show_dialog() {
 /* A function to show the dialog window */
    overlayme.style.display = "block";
    document.getElementById("confirm").onclick = function() {
        location.reload();
    }
}

   // If confirm btn is clicked , the function confim() is executed
   document.getElementById("confirm").onclick = function(){confirm()};
   function confirm() {
    /* code executed if confirm is clicked */ 
    turnEnd();
       overlayme.style.display = "none";
   }
   
   // If cancel btn is clicked , the function cancel() is executed
   document.getElementById("cancel").onclick = function(){cancel()};
   function cancel() {
    /* code executed if cancel is clicked */  
       overlayme.style.display = "none";
   }

   // To get the class collapsible
var coll = document.getElementsByClassName("collapsible");
var i;
// Loop for collapsing instructions and advice
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

/**
 * Displays the dialogue box depending on who's turn it now. Displays at the end of turn.
 * @param {*} currentTurn boolean value representing who's turn it is
 */
function displayTurn(currentTurn) {
    var modal = document.getElementById("myModal");
    var modalBlack = document.getElementById("myModalBlack");
    var span = document.getElementsByClassName("close")[0];
    var spanBlack = document.getElementsByClassName("closeBlack")[0];
    if (!currentTurn) {
        modal.style.display = "block";
    } else {
        modalBlack.style.display = "block";
    }
    span.onclick = function() {
        modal.style.display = "none";
    }

    spanBlack.onclick = function() {
    modalBlack.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modalBlack) {
        modalBlack.style.display = "none";
        }
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
