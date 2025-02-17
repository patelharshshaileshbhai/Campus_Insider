import { Router } from "express";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { createPost, createReview, deletePost, deleteReview, getAllPosts, getAllReviews, getPostById, getReviewById,} from "../controllers/review.controller";
import upload from "../middlewares/multer";


const router:Router=Router();

router.post('/create',
    upload.fields([
        {
            name:'file',
            maxCount:3
        }
    ]),isAuthenticated,createReview);

// //getAllReviews
router.get('/get',getAllReviews);
// //getReviewById
router.get('/get/:id',getReviewById)
router.delete('/delete/:id',isAuthenticated,deleteReview)
    

//post

router.post('/post/create',
    upload.fields([
        {
            name:'file',
            maxCount:3
        }
    ]),isAuthenticated,createPost);

// //getAllReviews
router.get('/post/get',getAllPosts);
// //getReviewById
router.get('/post/get/:id',getPostById)
router.delete('/post/delete/:id',isAuthenticated,deletePost)


export default router

