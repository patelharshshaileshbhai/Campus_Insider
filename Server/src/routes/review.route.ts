import { Router } from "express";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { createReview, getAuthorDetailByReviewId,  getReviewById, getReviews } from "../controllers/review.controller";
import upload from "../middlewares/multer";
import { authenticateUser } from "../middlewares/auth";

const router:Router=Router();

router.post('/create',
    upload.fields([
        {
            name:'file',
            maxCount:2
        }
    ]),authenticateUser,createReview);

//getAllReviews
router.get('/get',getReviews)
//getReviewById
router.get('/get/:id',getReviewById)

router.get('/get/author/:id',getAuthorDetailByReviewId)
    

export default router

