import { Router } from "express";
import {
  createUser,
  getMe,
  loginUser,
  logOut,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/authMiddleware";
import upload from "../middlewares/multer";


const router = Router();

router.post("/register", upload.single('profile'), createUser);
router.post("/login", loginUser);

router.get("/me", isAuthenticated, getMe);
router.post("/logout", isAuthenticated, logOut);

export default router;
