// helpers/handleSubmit.js or above your component
import { toast } from "react-toastify";

export const handleSubmit = async (
  formData,
  chatId,
  userId,
  sellerId,
  setMessages,
  socket
) => {
  try {
    if (!formData.trim()) {
      toast.warn("Message cannot be empty!");
      return;
    }

    const message = {
      chatId,
      senderId: userId,
      receiverId: sellerId,
      text: formData,
    };

    // Send via socket
    socket.emit("send-message", message);

    // Add locally
    setMessages((prev) => [...prev, message]);

    // Optional: Save to DB
    await fetch("http://localhost:4000/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    toast.success("Message sent!");
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to send message.");
  }
};
