"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const review_controller_1 = require("../controllers/review.controller");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = (0, express_1.Router)();
router.post('/create', multer_1.default.fields([
    {
        name: 'file',
        maxCount: 3
    }
]), authMiddleware_1.isAuthenticated, review_controller_1.createReview);
// //getAllReviews
router.get('/get', review_controller_1.getAllReviews);
// //getReviewById
router.get('/get/:id', review_controller_1.getReviewById);
router.delete('/delete/:id', authMiddleware_1.isAuthenticated, review_controller_1.deleteReview);
//post
router.post('/post/create', multer_1.default.fields([
    {
        name: 'file',
        maxCount: 3
    }
]), authMiddleware_1.isAuthenticated, review_controller_1.createPost);
// //getAllReviews
router.get('/post/get', review_controller_1.getAllPosts);
// //getReviewById
router.get('/post/get/:id', review_controller_1.getPostById);
router.delete('/post/delete/:id', authMiddleware_1.isAuthenticated, review_controller_1.deletePost);
router.post('/post/like', authMiddleware_1.isAuthenticated, review_controller_1.addLike);
router.post('/post/comment', authMiddleware_1.isAuthenticated, review_controller_1.addComment);
router.get('/post/comment/get/:postId', authMiddleware_1.isAuthenticated, review_controller_1.getAllCommentOfPost);
exports.default = router;
