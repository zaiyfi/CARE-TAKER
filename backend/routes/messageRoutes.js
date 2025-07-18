const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
// const requireAuth = require("../middleware/requireAuth"); // optional

// router.use(requireAuth);

router.post("/", messageController.sendMessage);
router.get("/:chatId", messageController.getMessagesByChatId);

module.exports = router;
