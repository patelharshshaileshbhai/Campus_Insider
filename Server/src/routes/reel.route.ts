import { Router } from "express";
import { isAuthenticated } from "../middlewares/authMiddleware";
import upload from "../middlewares/multer";
import { getReels,createReel } from "../controllers/reel.controller";


const router:Router=Router();

router.post('/createreel', isAuthenticated,upload.single('file'), createReel);
router.get('/getreels',getReels);

export default router

