import React from "react";
import "./chatContainer.css";
import MessagesContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";

// Component for displaying the chat container
const ChatContainer = ({ board, connection, currentUser, chat }) => (
  <div className="chatContainer">
    {/* Render messages container */}
    <MessagesContainer
      board={board}
      currentUser={currentUser}
      messages={chat.messages}
    />
    {/* Render send message form */}
    <SendMessageForm
      currentUser={currentUser}
      board={board}
      connection={connection}
      chat={chat}
    />
  </div>
);

export default ChatContainer;
