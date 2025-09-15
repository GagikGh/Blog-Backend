import express from "express";
import cors from "cors";
import postsRoutes from "./src/routes/postsRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.use("/posts", postsRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
