import { useState, useEffect, useRef } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useLocation } from "react-router-dom";
import socket from "../../socket";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [chatId, setChatId] = useState(" "); // saved chat id

  const location = useLocation();
  const { sellerId, userName } = location.state || {};
  const { auth } = useSelector((state) => state.auth);
  const { chats } = useSelector((state) => state.chat);

  const userId = auth?.user?._id;

  const messagesEndRef = useRef(null);
  const otherUser = (() => {
    if (!chatId || !chats.length || !auth?.user?._id) return null;
    const thisChat = chats.find((c) => c._id === chatId);
    if (!thisChat) return null;
    return thisChat.members.find((m) => m._id !== auth.user._id) || null;
  })();

  const otherUserName = otherUser?.name || userName || "Chat";
  const otherUserPic = otherUser?.pic || "/default-avatar.png"; // fallback
  const otherUserRole = otherUser?.role || "User";

  // keep socket listener + fetch chat/messages
  useEffect(() => {
    if (!userId || !sellerId) return; // wait until we have both

    // fetch messages helper
    const fetchMessages = async (cid) => {
      try {
        setLoadingMessages(true);
        const res = await fetch(`http://localhost:4000/api/messages/${cid}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setMessages(data || []);
        console.log("Fetched messages:", data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    // fetch or create chat and then messages
    const fetchChatId = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.token}`,
          },
          body: JSON.stringify({ userId, sellerId }),
        });
        const data = await res.json();
        if (data?._id) {
          setChatId(data._id);
          fetchMessages(data._id);
          console.log(data);
        } else {
          console.warn("No chat id returned:", data);
        }
      } catch (err) {
        console.error("Error fetching/creating chat:", err);
      }
    };

    // connect + join room (idempotent)
    if (!socket.connected) socket.connect();
    socket.emit("join-chat", { userId });

    // ensure only one listener is attached
    socket.off("receive-message");
    socket.on("receive-message", (message) => {
      console.log("Socket receive-message payload:", message); // debug
      setMessages((prev) => [...prev, message]);

      // only notify when message is from someone else
      if (message.senderId !== userId) {
        const senderName = message.senderName || "Someone";
        toast.info(
          <span>
            Received a new message from <strong>{senderName}</strong>
          </span>,
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
            closeOnClick: false, // avoid that removalReason error on click
          }
        );
      }
    });

    // get chat & messages
    fetchChatId();

    // cleanup listener on unmount or deps change
    return () => {
      socket.off("receive-message");
    };
  }, [userId, sellerId, userName, auth?.token]);

  // auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text) => {
    const message = {
      chatId: chatId,
      senderId: userId,
      senderName: auth.user.name,
      receiverId: sellerId,
      text,
    };
    console.log("Sending message:", message);

    // Emit to socket server
    socket.emit("send-message", message);

    // Add locally (if your server also emits to the sender you'll get a duplicate —
    // see note below if duplicates happen)
    setMessages((prev) => [...prev, message]);
    console.log("Message added locally:", message);

    // TODO: Save to DB via fetch/axios if needed
  };

  return (
    <>
      <div className="chat-window w-full max-w-2xl mx-auto p-4 h-[90vh] bg-white rounded-2xl shadow-lg flex flex-col">
        {/* Header */}
        <div className="border-b pb-3 mb-4 flex items-center gap-3">
          <img
            src={otherUserPic}
            alt={otherUserName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              {otherUserName}
            </h2>
            <p className="text-sm text-gray-500">{otherUserRole}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 px-2">
          <MessageList
            messages={messages}
            thisUserId={userId}
            loading={loadingMessages}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="pt-4 border-t mt-4 ">
          <MessageInput onSendMessage={sendMessage} />
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
