import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../../socket";
import { setChats } from "../../redux/chatSlice";
import store from "../../redux/store";
import { BsChatDotsFill } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FloatingChatList = () => {
  const { auth } = useSelector((state) => state.auth);
  const { chats } = useSelector((state) => state.chat);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMap, setUnreadMap] = useState({});

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isChatWindowOpen = location.pathname === "/chat";

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/chats/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          dispatch(setChats(data));
        }
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    if (auth?.user && chats.length === 0) {
      fetchChats();
    }

    if (auth?.user?._id) {
      socket.emit("join-chat", { userId: auth.user._id });

      socket.off("receive-message"); // prevent duplicate listeners
      socket.on("receive-message", (message) => {
        const chatId = message.chatId;

        if (!open) {
          setUnreadMap((prev) => ({
            ...prev,
            [chatId]: (prev[chatId] || 0) + 1,
          }));
        }

        // Toast notification if not in chat window
        if (!isChatWindowOpen && message.senderId !== auth.user._id) {
          const senderName = message.senderName || "Someone";
          toast.info(
            <span>
              Received a new message from <strong>{senderName}</strong>
            </span>,
            {
              position: "top-right",
              autoClose: 3000,
              theme: "colored",
              closeOnClick: false,
            }
          );
        }

        // Update chats list
        const currentChats = store.getState().chat.chats;
        const updatedChats = [...currentChats];
        const index = updatedChats.findIndex((c) => c._id === chatId);

        if (index !== -1) {
          updatedChats[index] = {
            ...updatedChats[index],
            lastMessage: message.text,
            updatedAt: new Date(),
          };
        } else {
          updatedChats.unshift({
            _id: chatId,
            members: [message.senderId, message.receiverId],
            lastMessage: message.text,
            updatedAt: new Date(),
          });
        }

        updatedChats.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        dispatch(setChats(updatedChats));
      });
    }

    return () => {
      socket.off("receive-message");
    };
  }, [
    auth.user?._id,
    open,
    isChatWindowOpen,
    chats.length,
    auth.token,
    dispatch,
  ]);

  const handleOpenChat = (chat) => {
    const otherUser = chat.members.find((m) => m._id !== auth.user._id);

    // Clear unread count for this chat
    setUnreadMap((prev) => {
      const newMap = { ...prev };
      delete newMap[chat._id];
      return newMap;
    });

    // Close the floating chat list
    setOpen(false);

    navigate("/chat", {
      state: {
        chatId: chat._id,
        sellerId: otherUser._id,
      },
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-9999">
      <div
        className="bg-primary text-white px-4 py-2 rounded-t-lg cursor-pointer flex items-center gap-2 relative"
        onClick={() => {
          setOpen(!open);
          if (!open) setUnreadCount(0);
        }}
      >
        <BsChatDotsFill className="text-lg" />
        <span>Chats</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
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
            const otherUser = chat.members.find(
              (m) => m && m._id !== auth.user._id
            );
            if (!otherUser) return null;

            return (
              <div
                key={chat._id}
                onClick={() => handleOpenChat(chat)}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b flex justify-between items-center"
              >
                <div className="font-medium">{otherUser.name || "User"}</div>

                {unreadMap[chat._id] > 0 && (
                  <span className="bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadMap[chat._id]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FloatingChatList;
