import { Router } from "express";

import postsRoutes from "./postsRoutes.js";
import loginRoutes from "./loginRoutes.js";
import registerRoutes from "./registerRoutes.js";


const router  = Router();

router.use("/posts", postsRoutes);
router.use("/login", loginRoutes);
router.use("/register", registerRoutes);

export default router;
