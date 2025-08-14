const { Server } = require("socket.io");

let onlineUsers = new Map();

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Add user to online map
    socket.on("join-chat", ({ userId }) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} joined the chat`);
    });

    // Handle message sending
    const Message = require("./models/chat_Models/messageSchema");

    socket.on(
      "send-message",
      async ({ chatId, senderId, senderName, receiverId, text }) => {
        try {
          // Save to DB
          console.log("Saving message to DB:", {
            chatId,
            senderId,
            senderName,
            receiverId,
            text,
          });
          const message = new Message({
            chatId,
            senderId,
            senderName,
            receiverId,
            text,
          });
          await message.save();

          // Send to receiver
          const receiverSocket = onlineUsers.get(receiverId);
          if (receiverSocket) {
            io.to(receiverSocket).emit("receive-message", message); // send full message object
          }
        } catch (err) {
          console.error("Error saving message:", err);
        }
      }
    );

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });
};
