// Function to update the game state after a move
const UpdateGame = (color, turn, move, dices, setDices, connection, chat) => {
  // Initialize variables
  const piece = document.getElementById(move[0]); // Selected piece
  const currentPlace = document.getElementById(move[1]); // Current position
  const nextPlace = document.getElementById("T" + move[2].match(/\d+/)); // Next position
  const midPart = document.getElementById("MidPart"); // Middle part of the board

  const currentId = parseInt(currentPlace.id.match(/\d+/)); // Current position id

  // Move piece out of the board
  if (move[2] === "pieceOut") {
    // Move piece to the piece out area
    document.getElementById("pieceOut").appendChild(piece);
    // Decrement dice count based on move
    if (piece.className === "black piece") {
      if (dices[1] === 25 - currentId && dices[0] > 0) dices[0]--;
      else if (dices[3] > 25 - currentId && dices[2] > 0) dices[2]--;
      else if (dices[3] === 25 - currentId && dices[2] > 0) dices[2]--;
      else if (dices[1] > 25 - currentId && dices[0] > 0) dices[0]--;
      piece.className = "none";
    }
    if (piece.className === "white piece") {
      if (dices[1] === currentId && dices[0] > 0) dices[0]--;
      else if (dices[3] > currentId && dices[2] > 0) dices[2]--;
      else if (dices[3] === currentId && dices[2] > 0) dices[2]--;
      else if (dices[1] > currentId && dices[0] > 0) dices[0]--;
      piece.className = "none";
    }
    setDices(dices); // Update dice state
    checkDices(connection, chat, dices, color, turn); // Check dice state
    return;
  }

  const nextId = parseInt(nextPlace.id.match(/\d+/)); // Next position id
  // Move to the middle part of the board
  if (move[1] === "MidPart") {
    // Decrement dice count based on move and color
    if (piece.classList.contains("black")) {
      if (nextId === dices[1] && dices[0] > 0) dices[0]--;
      else if (nextId === dices[3] && dices[2] > 0) dices[2]--;
    }
    if (piece.classList.contains("white")) {
      if (25 - nextId === dices[1] && dices[0] > 0) dices[0]--;
      else if (25 - nextId === dices[3] && dices[2] > 0) dices[2]--;
    }
    setDices(dices); // Update dice state
    checkDices(connection, chat, dices, color, turn); // Check dice state
  } else {
    // Move to a regular position on the board
    // Decrement dice count based on move and color
    if (piece.className === "black piece") {
      if (nextId - currentId === dices[1] && dices[0] > 0) dices[0]--;
      else if (nextId - currentId === dices[3] && dices[2] > 0) dices[2]--;
    }
    if (piece.className === "white piece") {
      if (currentId - nextId === dices[1] && dices[0] > 0) dices[0]--;
      else if (currentId - nextId === dices[3] && dices[2] > 0) dices[2]--;
    }
    setDices(dices); // Update dice state
    checkDices(connection, chat, dices, color, turn); // Check dice state
  }

  // Move to an empty position
  if (nextPlace.children.length === 1) {
    nextPlace.appendChild(piece);
    return;
  }

  // Move to a position occupied by a piece of the same color
  if (piece.className === nextPlace.children[1].className) {
    nextPlace.appendChild(piece);
    return;
  }

  // Move to a position occupied by a piece of the opposite color (eat)
  if (nextPlace.children.length === 2) {
    midPart.appendChild(nextPlace.children[1]); // Move eaten piece to the middle
    nextPlace.appendChild(piece); // Move current piece to the destination
  }
};

// Function to check dice state and roll dice if necessary
const checkDices = (connection, chat, dices, color, turn) => {
  // Check if connection, dice state, and chat are valid
  if (connection && dices && chat) {
    // If both dice are used, roll dice and switch turn if it's the player's turn
    if (dices[0] === 0 && dices[2] === 0) {
      connection.invoke("RollDice", chat);
      if (color === turn) connection.invoke("NextTurn", chat, color);
    }
  }
};

export default UpdateGame; 
