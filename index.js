import dotenv from 'dotenv';
dotenv.config();

import cors from "cors";
import express from "express";
import router from "./src/routes/index.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 4001;

const app = express();

app.use(cors({
    origin: "http://localhost:3002",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use(cookieParser());

app.use(express.json());

app.use("/", router)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
