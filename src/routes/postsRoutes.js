import express from "express";
import {
    getPosts,
    getPostById,
    addPost,
    updatePost,
    deletePost,
    getPostsByTag
} from "../controllers/postsController.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPostById);
router.get("/tag/:id", getPostsByTag);
router.post("/", addPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
