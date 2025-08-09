import { useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import socket from "../../socket";
import { useSelector } from "react-redux";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [chatId, setChatId] = useState(" "); // 🔑 Save chatId here

  const location = useLocation();
  const { sellerId } = location.state || {};
  const { userName } = location.state || {};

  const { auth } = useSelector((state) => state.auth);

  const userId = auth.user._id; // 🔁 Replace with actual logged-in user ID

  useEffect(() => {
    const fetchMessages = async (chatId) => {
      try {
        setLoadingMessages(true); // start loading
        const res = await fetch(
          `http://localhost:4000/api/messages/${chatId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        setMessages(data);
        console.log("Fetched messages:", data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingMessages(false); // stop loading
      }
    };

    // Connect to socket and join chat
    if (!socket.connected) {
      socket.connect();
      socket.emit("join-chat", { userId });
    }

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Fetch chatId if not already set
    const fetchChatId = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
            // Include the token for authentication
          },
          body: JSON.stringify({ userId, sellerId }),
        });

        const data = await res.json();
        setChatId(data._id); // 🔑 Save the chatId
        fetchMessages(data._id); // Fetch messages after getting chatId
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };

    if (userId && sellerId) {
      fetchChatId();
    }

    return () => {
      socket.off("receive-message");
    };
  }, [userId]);

  const sendMessage = (text) => {
    const message = {
      chatId: chatId,
      senderId: userId,
      receiverId: sellerId,
      text,
    };
    console.log("Sending message:", message);

    // Emit to socket server
    socket.emit("send-message", message);

    // Add locally
    setMessages((prev) => [...prev, message]);
    console.log("Message sent:", message);

    // TODO: Save to DB using fetch/axios to /api/messages
  };

  return (
    <div className="chat-window w-full max-w-2xl mx-auto p-4 h-[90vh] bg-white rounded-2xl shadow-lg flex flex-col">
      {/* Header */}
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          {userName || "Chat with Caregiver"}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 px-2">
        <MessageList
          messages={messages}
          thisUserId={userId}
          loading={loadingMessages}
        />
      </div>

      {/* Input */}
      <div className="pt-4 border-t mt-4 ">
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
