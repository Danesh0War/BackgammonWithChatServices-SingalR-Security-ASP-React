import React, { useState, useEffect } from "react";
import "./GameLogic.css";
import UpdateGame from "./UpdateGame";
import useSound from "use-sound";
import pieceSound from "../../../assets/sounds/piece.mp3";
import diceSound from "../../../assets/sounds/dice.mp3";

const GameLogic = ({
  move,
  currentUser,
  turn,
  color,
  setDices,
  dices,
  board,
  connection,
  chat,
}) => {
  // State for the active piece selected by the player
  const [activePiece, setActivePiece] = useState();

  // Custom hooks for playing sound effects
  let [playPiece] = useSound(pieceSound);
  let [playDice] = useSound(diceSound);

  // States to track whether black and white pieces are in the finish area
  const [isBlackInFinish, setBlackInFinish] = useState(false);
  const [isWhiteInFinish, setWhiteInFinish] = useState(false);

  // Function to update the board after a move
  const Update = (currentPlace, nextPlace) => {
    connection.invoke(
      "UpdateBoard",
      chat,
      activePiece.id,
      currentPlace.id,
      nextPlace.id
    );
  };

  // Function to roll the dice
  const RollDice = () => {
    connection.invoke("RollDice", chat);
    connection.invoke("NextTurn", chat, color);
  };

  // Event handler for clicking on board elements
  const onClick = (e) => {
    // Prevent actions if it's not the player's turn
    if (turn !== color) return;

    const element = e.target;
    // If an active piece is selected and the clicked element is a valid move
    if (
      activePiece &&
      (element.classList.contains("none-selected") || element.id === "pieceOut")
    ) {
      Update(activePiece.parentElement, element);
    }
    // If an active piece is selected and clicked again, deselect it
    if (activePiece && activePiece !== element) {
      activePiece.style.border = "";
      document.getElementById("pieceOut").className = "none";
      setActivePiece(null);
    }
    // If the clicked element is the player's own piece, select it
    if (element.className === color + " piece") {
      element.style.border = "solid #ffff 2px";
      setActivePiece(element);
    }
  };

  // Effect to update available moves when active piece changes
  useEffect(() => {
    resetColor();
    if (!activePiece) return;
    // If active piece is in the middle, show available moves based on dice rolls
    if (activePiece.parentElement.id === "MidPart") {
      if (color === "black") {
        if (dices[0] > 0) colorIt(dices[1]);
        if (dices[2] > 0) colorIt(dices[3]);
      }
      if (color === "white") {
        if (dices[0] > 0) colorIt(25 - dices[1]);
        if (dices[2] > 0) colorIt(25 - dices[3]);
      }
      return;
    }

    // Otherwise, show available moves based on current position and dice rolls
    const midPart = document.getElementById("MidPart");
    for (let i = 0; i < midPart.children.length; i++) {
      if (midPart.children[i].classList.contains(color)) return;
    }

    const placeId = parseInt(activePiece.parentElement.id.match(/\d+/));
    if (color === "black") {
      if (dices[0] > 0) colorIt(placeId + dices[1], placeId);
      if (dices[2] > 0) colorIt(placeId + dices[3], placeId);
    }
    if (color === "white") {
      if (dices[0] > 0) colorIt(placeId - dices[1], placeId);
      if (dices[2] > 0) colorIt(placeId - dices[3], placeId);
    }
  }, [activePiece]);

  // Function to highlight available moves based on dice rolls
  const colorIt = (num, placeId) => {
    // Check if piece can be moved out of the board
    if (color === "black" && num > 24) {
      if (checkValidToOut(1, 25 - placeId, 19, placeId - 1)) {
        setBlackInFinish(true);
        PieceOut(1, 18);
      }
      if (checkValidToOut(3, 25 - placeId, 19, placeId - 1)) {
        setBlackInFinish(true);
        PieceOut(1, 18);
      }
      return;
    }
    if (color === "white" && num < 1) {
      if (checkValidToOut(1, placeId, placeId + 1, 6)) {
        setWhiteInFinish(true);
        PieceOut(7, 24);
      }
      if (checkValidToOut(3, placeId, placeId + 1, 6)) {
        setWhiteInFinish(true);
        PieceOut(7, 24);
      }
      return;
    }

    // Highlight available moves
    const lst = document.getElementById("T" + num).children;
    let otherColor;
    let count = 0;
    if (lst) {
      for (let i = lst.length - 1; i > -1; i--) {
        if (lst[i].id.match("N")) {
          if (!otherColor || otherColor.includes(color) || count < 2)
            lst[i].className = "piece none-selected";
        } else {
          otherColor = lst[i].className;
          count++;
        }
      }
    }
  };

  // Function to reset highlighted moves
  const resetColor = () => {
    let piece;
    for (let i = 0; i < 25; i++) {
      piece = document.getElementById("N" + i);
      if (piece) piece.className = "piece none";
    }
  };

  // Function to check if moving out of the board is valid
  const checkValidToOut = (diceNum, placeNum, from, to) => {
    if (dices[diceNum] === placeNum && dices[diceNum - 1] > 0) return true;

    if (dices[diceNum - 1] > 0) {
      for (let i = from; i <= to; i++) {
        let place = document.getElementById("T" + i);
        if (place.children[1] && place.children[1].classList.contains(color))
          return false;
      }
      return true;
    }
    return false;
  };

  // Function to handle moving a piece out of the board
  const PieceOut = (from, to) => {
    for (let i = from; i <= to; i++) {
      let place = document.getElementById("T" + i);
      for (let j = 0; j < place.children.length; j++) {
        if (place.children[j].classList.contains(color)) return;
      }
    }
    document.getElementById("pieceOut").className = "pieceOut";
  };

  // Effect to play dice sound and check if game ended after rolling dice
  useEffect(() => {
    if (dices) playDice();
    checkCantMoveBtn();
    let colorWin = checkEnd();
    if (colorWin) {
      connection.invoke("EndGame", chat, colorWin);
    }
  }, [dices]);

  // Effect to update game state after a move
  useEffect(() => {
    if (move && dices) {
      checkCantMoveBtn();
      UpdateGame(color, turn, move, dices, setDices, connection, chat);
      playPiece();
      let colorWin = checkEnd();
      if (colorWin) {
        connection.invoke("EndGame", chat, colorWin);
      }
    }
  }, [move]);

  // Effect to update game state when turn changes
  useEffect(() => {
    if (!turn || !color) return;
    let myTurn = document.getElementById("myTurn");
    let otherTurn = document.getElementById("otherTurn");
    if (!myTurn || !otherTurn) return;

    // Update turn indicator based on whose turn it is
    if (turn === color) {
      myTurn.className = "userInfo turn";
      otherTurn.className = "userInfo";
    } else {
      myTurn.className = "userInfo";
      otherTurn.className = "userInfo turn";
    }

    checkCantMoveBtn();
  }, [turn]);

  // Function to check if the game ended
  const checkEnd = () => {
    var tmpColor;
    for (let i = 1; i <= 24; i++) {
      let place = document.getElementById("T" + i);
      if (place && place.children[1]) {
        if (tmpColor && tmpColor + " piece" !== place.children[1].className)
          return null;
        if (place.children[1].classList.contains("white")) tmpColor = "white";
        if (place.children[1].classList.contains("black")) tmpColor = "black";
      }
    }
    return tmpColor;
  };

  // Function to check if the player can make any move
  const checkCantMoveBtn = () => {
    if (color === "black" && isBlackInFinish) return;
    if (color === "white" && isWhiteInFinish) return;

    let btn = document.getElementById("cantMoveBtn");
    if (!btn) return;

    if (color && turn && color === turn && !checkIfCanMove()) {
      btn.disabled = false;
      btn.className = "";
    } else {
      btn.disabled = true;
      btn.className = "cantMoveBtn";
    }
  };

  // Function to check if any move is possible
  const checkIfCanMove = () => {
    let mid = document.getElementById("MidPart");
    if (mid && mid.children.length > 0) {
      for (let i = 0; i < mid.children.length; i++) {
        if (mid.children[i] && mid.children[i].classList.contains(color)) {
          if (dices[0] > 0 && checkIfCanGoToPlaceByDice(1)) return true;
          if (dices[2] > 0 && checkIfCanGoToPlaceByDice(3)) return true;
          return false;
        }
      }
    }

    for (let i = 1; i <= 24; i++) {
      let triangle = document.getElementById("T" + i);
      if (!triangle) return true;

      if (!triangle.children[1]) continue;
      if (triangle.children[1].classList.contains(color)) {
        if (dices[0] > 0 && chackNextMoveValid(i, 1)) return true;
        if (dices[2] > 0 && chackNextMoveValid(i, 3)) return true;
      }
    }
    return false;
  };

  // Function to check if a piece can be moved to a place based on dice rolls
  const checkIfCanGoToPlaceByDice = (diceNum) => {
    let tplace;
    if (color === "white") tplace = 25 - dices[diceNum];
    if (color === "black") tplace = dices[diceNum];

    let place = document.getElementById("T" + tplace).children;
    if (!place[2]) return true;
    if (place[2].classList.contains(color)) return true;
    return false;
  };

  // Function to check if a move to the next place is valid
  const chackNextMoveValid = (placeNum, diceNum) => {
    let num = 0;
    if (color === "white") num = placeNum - dices[diceNum];
    if (color === "black") num = placeNum + dices[diceNum];

    let nextPlace = document.getElementById("T" + num);
    if (nextPlace) {
      if (!nextPlace.children[2]) return true;
      if (nextPlace.children[2].classList.contains(color)) return true;
    }
    return false;
  };

  // Render the game interface
  return (
    <div>
      {!board ? null : (
        <div className="gameHub" onClick={(e) => onClick(e)}>
          <div>
            <div className="users">
              <div className={"topPiece " + color} />
              <div id={"myTurn"} className="userInfo">
                You
              </div>
              <button
                id="cantMoveBtn"
                className="cantMoveBtn"
                onClick={() => RollDice()}
              >
                You Can't Move Roll Dice Now!
              </button>
              <div id={"otherTurn"} className="userInfo">
                {chat.users[0] === currentUser.username
                  ? chat.users[1]
                  : chat.users[0]}
              </div>
              <div
                className={
                  "topPiece " + (color === "white" ? "black" : "white")
                }
              />
            </div>
            {board}
          </div>
          <div className="pieceOutArea">
            <div id={"pieceOut"} className="none" />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLogic;
