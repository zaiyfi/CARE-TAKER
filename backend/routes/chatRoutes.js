const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

const chatController = require("../controllers/chatController");
// const requireAuth = require("../middleware/requireAuth"); // optional

// router.use(requireAuth);

router.post("/", requireAuth, chatController.createOrGetChat);
router.get("/", requireAuth, chatController.getUserChats);
router.get("/:chatId", requireAuth, chatController.getChatById);

module.exports = router;
