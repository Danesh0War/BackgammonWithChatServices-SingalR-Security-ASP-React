import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import CreatBoard from "./LobbyHub/GameContainer/Board";

// Function to establish connection with the SignalR hub and handle incoming events
const Connect = (
  setTurn,
  setBoard,
  setColor,
  setMove,
  setDices,
  setConnection,
  setCurrentUser,
  setUsers,
  setChat
) => {
    // Create a new SignalR connection
  let connection = new HubConnectionBuilder()
    .withUrl("https://localhost:5001/main") // currently on developing port (mainhub)
    .configureLogging(LogLevel.Information)
    .build();

   // Event handler for "EndGame" event
   connection.on("EndGame", () => {
    setBoard(null); // Reset the game board
  });

  // Event handler for "WantToPlayWithYou" event
  connection.on("WantToPlayWithYou", (otherUser, flag) => {
    // Update UI to indicate play request
    let circle = document.getElementById("C" + otherUser);
    let other = document.getElementById(otherUser);

    if (flag) circle.className = "circle play";
    else if (other.classList.contains("online-user")) circle.className = "circle on";
    else circle.className = "circle off";
  });

  // Event handler for "Turn" event
  connection.on("Turn", (turn) => {
    setTurn(turn); // Update turn in the game state
  });

  // Event handler for "CanPlay" event
  connection.on("CanPlay", () => {
    setBoard(CreatBoard()); // Create the game board
  });

  // Event handler for "GetColor" event
  connection.on("GetColor", (color) => {
    setColor(color); // Update color in the game state
  });

  // Event handler for "UpdateBoard" event
  connection.on("UpdateBoard", (move) => {
    setMove(move); // Update move in the game state
  });

  // Event handler for "GetDice" event
  connection.on("GetDice", (dice1, dice2) => {
    // Update dice values in the game state
    if (dice1 === dice2) setDices([2, dice1, 2, dice2]);
    else setDices([1, dice1, 1, dice2]);

    // Update UI to display dice values
    document.getElementById("firstDice").className = "firstDice dice" + dice1;
    document.getElementById("secondDice").className = "secondDice dice" + dice2;
  });

  // Event handler for "IsLogined" event
  connection.on("IsLogined", (user) => {
    // Handle login response
    !user ? console.log("Can't login to that user!") : setCurrentUser(user);
  });

  // Event handler for "IsRegistered" event
  connection.on("IsRegistered", (flag) => {
    // Handle registration response
    flag ? console.log(`Registered!`) : console.log(`Already in Database`);
  });

  // Event handler for "GetUsers" event
  connection.on("GetUsers", (users) => {
    // Update user list in the game state
    !users ? console.log("Can't find users!") : setUsers(users);
  });

  // Event handler for "GetChat" event
  connection.on("GetChat", (chat) => {
    // Update chat object in the game state
    setChat(chat);
  });

  // Event handler for "SendMessage" event
  connection.on("SendMessage", (flag) => {
    // Handle message sending response
    !flag ? console.log("Can't send message!") : console.log("Message sent!");
  });

  // Start the SignalR connection
  connection.start();
  // Set the SignalR connection object in the game state
  setConnection(connection);
  console.log("Connection established!");
};

export default Connect;
