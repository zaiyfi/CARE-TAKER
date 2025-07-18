import React from "react";

const ChatHeader = ({ title, onClose }) => {
  return (
    <div className="chat-header">
      <h2>{title}</h2>
    </div>
  );
};

export default ChatHeader;
