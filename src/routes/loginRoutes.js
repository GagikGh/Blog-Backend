import express from "express";
import { login } from "../controllers/signController.js";

const router = express.Router();

router.post("/", login);

export default router;
