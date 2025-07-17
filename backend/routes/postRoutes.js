import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { createPost, deletePost, getFeedPosts, getPost, getUserPosts, likeUnlikePost, replyToPost } from './../controllers/postController.js';

const router = express.Router(); 

router.post("/feed", getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", createPost);
router.post("/delete/:id/:userId", deletePost);
router.put("/like/:id", likeUnlikePost);
router.put("/reply/:id", replyToPost);

export default router;
