import { useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(" "); // 🔑 Save chatId here

  const location = useLocation();
  const { productId, sellerId } = location.state || {};
  const { auth } = useSelector((state) => state.auth);

  const socket = useRef(null);
  const userId = auth.user._id; // 🔁 Replace with actual logged-in user ID

  useEffect(() => {
    socket.current = io("http://localhost:4000"); // or your backend domain

    socket.current.emit("join-chat", { userId });

    socket.current.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    const fetchChatId = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, sellerId }),
        });

        const data = await res.json();
        setChatId(data._id); // 🔑 Save the chatId
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };

    if (userId && sellerId) {
      fetchChatId();
    }

    return () => {
      socket.current.disconnect();
    };
  }, [userId]);

  const sendMessage = (text) => {
    const message = {
      chatId: chatId,
      senderId: userId,
      receiverId: sellerId,
      text,
    };

    // Emit to socket server
    socket.current.emit("send-message", message);

    // Add locally
    setMessages((prev) => [...prev, message]);

    // TODO: Save to DB using fetch/axios to /api/messages
  };

  return (
    <div className="chat-window w-full max-w-2xl mx-auto p-4 h-[90vh] bg-white rounded-2xl shadow-lg flex flex-col">
      {/* Header */}
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Chat with Seller
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 px-2">
        <MessageList messages={messages} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t mt-4">
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
