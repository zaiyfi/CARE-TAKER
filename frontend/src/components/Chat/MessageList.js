import React, { useEffect, useRef } from "react";

const MessageList = ({ messages, thisUserId }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // run on every message update

  return (
    <div className="overflow-y-auto h-full px-2 space-y-3 scroll-smooth scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-100">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.receiverId !== thisUserId ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`rounded-lg px-4 py-2 text-sm max-w-[75%] ${
              message.receiverId !== thisUserId
                ? "bg-lightPrimary text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <p>{message.text}</p>
          </div>
          <span className="font-light text-xs text-gray-500 ml-2">
            {message.senderId === thisUserId &&
              message.receiverId !== thisUserId &&
              "You"}
          </span>
        </div>
      ))}
      {/* Scroll anchor to bottom */}
      <div ref={bottomRef}></div>
    </div>
  );
};

export default MessageList;
