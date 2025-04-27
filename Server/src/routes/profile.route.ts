import { Router } from "express";
import { isAuthenticated } from "../middlewares/authMiddleware";
import upload from "../middlewares/multer";
import { getMyPosts,getMyReviews } from "../controllers/profile.controller";


const router:Router=Router();

router.get('/getmyposts',isAuthenticated,getMyPosts);
router.get('/getmyreviews',isAuthenticated,getMyReviews);

export default router

