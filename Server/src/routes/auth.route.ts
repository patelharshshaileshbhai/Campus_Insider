import { Router } from "express";
import {
  createUser,
  getMe,
  loginUser,
  logOut,
  googleCallback
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/authMiddleware";
import upload from "../middlewares/multer";
import passport from '../config/passport'


const router = Router();

router.post("/register", upload.single('profile'), createUser);
router.post("/login", loginUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), googleCallback);

router.get("/me", isAuthenticated, getMe);
router.post("/logout", isAuthenticated, logOut);

export default router;
