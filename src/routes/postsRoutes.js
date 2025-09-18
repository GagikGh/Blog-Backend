import express from "express";
import { auth } from "../../middleware/auth.js";
import {
    getPosts,
    getPostById,
    addPost,
    updatePost,
    deletePost,
    getPostsByTag,
    addComment, getComments
} from "../controllers/postsController.js";

const router = express.Router();

router.get("/",getPosts);
router.get("/:id", getPostById);
router.get("/tag/:id", getPostsByTag);
router.get("/:id/comments", getComments);

router.post("/", auth, addPost);
router.post("/:id/comments", auth, addComment);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
