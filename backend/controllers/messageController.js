const Message = require("../models/chat_Models/messageSchema");

exports.sendMessage = async (req, res) => {
  const { chatId, text } = req.body;
  const sender = req.user.id;

  try {
    const message = new Message({ chatId, sender, text });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};

exports.getMessagesByChatId = async (req, res) => {
  try {
    const messages = await Message.find({
      chatId: req.params.chatId,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to load messages" });
  }
};
