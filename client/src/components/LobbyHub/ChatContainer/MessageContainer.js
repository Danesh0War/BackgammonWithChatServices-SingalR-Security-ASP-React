import React, { useEffect, useRef, useState } from "react";
import "./messageContainer.css";
import useSound from "use-sound";
import recive from "../../../assets/sounds/recive.mp3";

// Component for displaying messages in the chat
const MessagesContainer = ({ board, currentUser, messages }) => {
  const messageRef = useRef(); // Reference for the message container
  const [classname, setClassname] = useState("big"); // State for adjusting container size
  const [play] = useSound(recive); // Sound effect for receiving messages

  // Effect to adjust container size based on the board state
  useEffect(() => {
    if (board) setClassname("small");
    else setClassname("big");
  }, [board]);

  // Effect to scroll to the bottom of the message container and play sound on new message
  useEffect(() => {
    if (messageRef && messageRef.current) {
      const { scrollHeight, clientHeight } = messageRef.current;
      messageRef.current.scrollTo({
        left: 0,
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
    if (
      messages &&
      messages.length > 0 &&
      messages[messages.length - 1].sender !== currentUser.username
    )
      play();
  }, [messages]);

  return (
    <div ref={messageRef} className={"message-container " + classname}>
      {/* Render messages */}
      {messages.map((m, index) =>
        m.sender === currentUser.username ? (
          // If message is from the current user
          <div className="sender" key={index}>
            <div className="message color-sender">
              <div className="message-text">{m.text}</div>
              <div className="message-date">{m.date}</div>
            </div>
          </div>
        ) : m.sender === "Server" ? (
          // If message is from the server
          <div className="server" key={index}>
            <div className="message color-server">
              <div className="message-text">{m.text}</div>
            </div>
          </div>
        ) : (
          // If message is from another user
          <div className="reciver" key={index}>
            <div className="message color-reciver">
              <div className="message-name">{m.sender}</div>
              <div className="message-text">{m.text}</div>
              <div className="message-date">{m.date}</div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default MessagesContainer;
