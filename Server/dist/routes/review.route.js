"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const multer_1 = __importDefault(require("../middlewares/multer"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/create', multer_1.default.fields([
    {
        name: 'file',
        maxCount: 2
    }
]), auth_1.authenticateUser, review_controller_1.createReview);
//getAllReviews
router.get('/get', review_controller_1.getReviews);
//getReviewById
router.get('/get/:id', review_controller_1.getReviewById);
router.get('/get/author/:id', review_controller_1.getAuthorDetailByReviewId);
exports.default = router;
