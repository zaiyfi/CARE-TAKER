const Chat = require("../models/chat_Models/chatSchema");

exports.createOrGetChat = async (req, res) => {
  const { sellerId } = req.body;
  const userId = req.user._id; // Get userId from the request object
  // assuming middleware adds this

  try {
    let chat = await Chat.findOne({
      members: { $all: [userId, sellerId] },
    });

    if (!chat) {
      chat = new Chat({ members: [userId, sellerId] });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Failed to create/fetch chat" });
  }
};

exports.getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      members: { $in: [req.user.id] },
    })
      .sort({ updatedAt: -1 })
      .populate("members", "name email pic"); // populate name, email, and pic

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Failed to get chats" });
  }
};

exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat" });
  }
};
