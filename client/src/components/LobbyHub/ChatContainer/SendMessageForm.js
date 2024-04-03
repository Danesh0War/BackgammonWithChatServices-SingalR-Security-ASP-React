import React, { useState, useEffect } from "react";
import "./sendMessageForm.css";
import useSound from "use-sound";
import send from "../../../assets/sounds/send.mp3";

// Component for sending messages in chat
const SendMessageForm = ({ currentUser, board, connection, chat }) => {
  const [message, setMessage] = useState(""); // State for the message input
  const [classname, setClassname] = useState("bigBar"); // State for adjusting input size
  const [play] = useSound(send); // Sound effect for sending messages

  // Effect to adjust input size based on the board state
  useEffect(() => {
    if (board) setClassname("smallBar");
    else setClassname("bigBar");
  }, [board]);

  // Function to initiate a game request and roll dice
  const sendGame = async () => {
    await connection.invoke("WantToPlayWith", chat);
    await connection.invoke("RollDice", chat);
  };

  // Function to send a message
  const sendMessage = async () => {
    await connection.invoke(
      "SendMessageAsync", 
      currentUser.username,
      chat,
      message,
      true
    );
    setMessage(""); // Clear the message input
    play(); // Play the send message sound
  };

  return (
    <form
      className="bar"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(message);
      }}
    >
      {/* Message input */}
      <input
        className={"message-input " + classname}
        placeholder="message..."
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      {/* Button to initiate a game if not in the All chat and not on the board */}
      {chat.users[1] === "allChat" ? null : !board ? (
        <button className="btn" type="button" onClick={() => sendGame()}>
          🎲
        </button>
      ) : null}
      {/* Button to send the message */}
      <button className="btn send" type="submit" disabled={!message}>
        &gt;
      </button>
    </form>
  );
};

export default SendMessageForm;
