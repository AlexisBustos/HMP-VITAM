import { Router } from "express";
import { register, login, refresh } from "./auth.controller";
import { requireAuth } from "../common/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", requireAuth, refresh);

export default router;

