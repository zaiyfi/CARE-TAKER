import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../../socket";
import { setChats } from "../../redux/chatSlice";
import store from "../../redux/store";

const FloatingChatList = () => {
  const { auth } = useSelector((state) => state.auth);
  const { chats } = useSelector((state) => state.chat);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Use useLocation to determine if the chat window is open
  const location = useLocation();
  const dispatch = useDispatch();

  const isChatWindowOpen = location.pathname === "/chat";

  const navigate = useNavigate();

  useEffect(() => {
    // update as per your backend

    const fetchChats = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/chats/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
            // Include the token for authentication
          },
        });
        const data = await res.json();
        if (res.ok) {
          dispatch(setChats(data));
          console.log(store.getState());
        }
        console.log("Fetched chats:", data);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    if (auth?.user && chats.length === 0) {
      fetchChats();
    }

    if (auth?.user?._id && !isChatWindowOpen) {
      socket.emit("join-chat", { userId: auth.user._id });

      socket.on("receive-message", (message) => {
        if (!open) {
          setUnreadCount((prev) => prev + 1);
        }

        // Clone the existing chats
        const currentChats = store.getState().chat.chats;
        const updatedChats = [...currentChats];
        const index = updatedChats.findIndex((c) => c._id === message.chatId);

        if (index !== -1) {
          updatedChats[index] = {
            ...updatedChats[index],
            lastMessage: message.text,
            updatedAt: new Date(),
          };
        } else {
          // If new chat somehow comes in, push it
          updatedChats.unshift({
            _id: message.chatId,
            members: [message.senderId, message.receiverId],
            lastMessage: message.text,
            updatedAt: new Date(),
          });
        }

        // Sort by updated time
        updatedChats.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        dispatch(setChats(updatedChats));
      });
    }

    console.log("Fetching chats for user:", auth.user._id);

    return () => {
      socket.off("receive-message");
    };
  }, [auth.user._id, open]);

  const handleOpenChat = (chat) => {
    // Get the other participant
    const otherUser = chat.members.find((m) => m._id !== auth.user._id);
    navigate("/chat", {
      state: {
        chatId: chat._id,
        sellerId: otherUser._id,
      },
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className="bg-primary text-white px-4 py-2 rounded-t-lg cursor-pointer"
        onClick={() => {
          setOpen(!open);
          if (!open) setUnreadCount(0);
        }}
      >
        💬 Chats
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-ping">
            {unreadCount}
          </span>
        )}
      </div>

      {open && (
        <div className="bg-white w-72 max-h-96 overflow-y-auto shadow-lg rounded-b-lg border border-gray-200">
          {chats.length === 0 && (
            <div className="p-4 text-gray-500">No chats yet</div>
          )}
          {chats.map((chat) => {
            console.log("Chat data:", chat);
            if (!chat.members || !Array.isArray(chat.members)) return null; // safety check

            const otherUser = chat.members.find(
              (m) => m && m._id !== auth.user._id
            );

            if (!otherUser) return null; // if no valid other user, skip

            return (
              <div
                key={chat._id}
                onClick={() => handleOpenChat(chat)}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b"
              >
                <div className="font-medium">{otherUser.name || "User"}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FloatingChatList;
