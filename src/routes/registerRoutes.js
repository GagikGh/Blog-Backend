import express from "express";
import { register } from "../controllers/signController.js";

const router = express.Router();

router.post("/", register);

export default router;
