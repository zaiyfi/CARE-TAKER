import React from "react";

const MessageList = ({ messages }) => {
  return (
    <div className="message-list overflow-y-auto h-full px-2 space-y-3 scroll-smooth">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.sender === "client" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`rounded-lg px-4 py-2 text-sm max-w-[75%] ${
              message.sender === "client"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <p>{message.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
