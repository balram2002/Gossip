import express from "express";
import { getMessages, sendMessage, getConversations } from "../controllers/messageController.js";

const router = express.Router(); 

router.post("/conversations", getConversations);
router.post("/:otherUserId", getMessages);
router.post("/", sendMessage);

export default router;
