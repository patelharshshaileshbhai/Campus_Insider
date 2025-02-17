import { Router } from "express";
import {
  createUser,
  getMe,
  loginUser,
  logOut,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/authMiddleware";


const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);

router.get("/me", isAuthenticated, getMe);
router.post("/logout", isAuthenticated, logOut);

export default router;
