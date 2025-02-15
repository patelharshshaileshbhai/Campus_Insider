"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthorDetailByReviewId = exports.getReviewById = exports.getReviews = exports.createReview = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const errorHandler_1 = require("../utils/errorHandler");
const errorHandler_2 = require("../utils/errorHandler");
const cloudinary_1 = require("../utils/cloudinary");
const StatusCodes_1 = require("../utils/StatusCodes");
exports.createReview = (0, errorHandler_2.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    // Validate required fields
    if (!title || !content) {
        res.status(StatusCodes_1.StatusCode.BAD_REQUEST).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.BAD_REQUEST, null, "Title and content are required"));
        return;
    }
    // Check if user is authenticated
    if (!req.user) {
        res.status(StatusCodes_1.StatusCode.UNAUTHORIZED).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.UNAUTHORIZED, null, "Unauthorized"));
        return;
    }
    // Validate author role and existence
    let isValidAuthor = false;
    if (req.user.role === "student") {
        const studentExists = yield prisma_1.default.student.findUnique({ where: { id: req.user.id } });
        if (studentExists)
            isValidAuthor = true;
    }
    else if (req.user.role === "faculty") {
        const facultyExists = yield prisma_1.default.faculty.findUnique({ where: { id: req.user.id } });
        if (facultyExists)
            isValidAuthor = true;
    }
    if (!isValidAuthor) {
        res.status(StatusCodes_1.StatusCode.BAD_REQUEST).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.BAD_REQUEST, null, "Invalid author ID"));
        return;
    }
    // Handle file uploads (optional)
    const files = req.files; // Cast to correct type
    const uploadedImages = []; // Store URLs of uploaded images
    if (files && files["file"] && files["file"].length > 0) {
        for (const file of files["file"]) {
            const uploadedImage = yield (0, cloudinary_1.uploadOnCloudinary)(file.path);
            if (uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url) {
                uploadedImages.push(uploadedImage.secure_url); // Store each uploaded image URL
            }
        }
        // If all uploads fail, return an error
        if (uploadedImages.length === 0) {
            res.status(StatusCodes_1.StatusCode.INTERNAL_SERVER_ERROR).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.INTERNAL_SERVER_ERROR, null, "Failed to upload images"));
            return;
        }
    }
    let reviewedUser;
    if (req.user.role === "student") {
        reviewedUser = yield prisma_1.default.student.findUnique({
            where: { id: req.user.id },
            select: {
                fullname: true,
                college: {
                    select: { name: true }
                }
            }
        });
    }
    else if (req.user.role === "faculty") {
        reviewedUser = yield prisma_1.default.faculty.findUnique({
            where: { id: req.user.id },
            select: {
                fullname: true,
                college: {
                    select: { name: true }
                }
            }
        });
    }
    // Create the review with or without images
    const newReview = yield prisma_1.default.review.create({
        data: {
            title,
            content,
            createdAt: new Date(),
            imageUrl: uploadedImages.length > 0 ? uploadedImages.join(",") : undefined, // Optional field
            authorType: req.user.role === "student" ? "STUDENT" : "FACULTY",
            authorId: req.user.id,
            authorDetail: reviewedUser || {}
        },
    });
    res.status(StatusCodes_1.StatusCode.CREATED).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.CREATED, newReview, "Review created successfully"));
    return;
}));
exports.getReviews = (0, errorHandler_2.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield prisma_1.default.review.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            imageUrl: true,
            authorType: true,
            authorId: true
        },
    });
    res.status(StatusCodes_1.StatusCode.OK).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, reviews, "Reviews fetched successfully"));
}));
exports.getReviewById = (0, errorHandler_2.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const review = yield prisma_1.default.review.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            imageUrl: true,
            authorType: true,
            authorId: true
        },
    });
    if (!review) {
        res.status(StatusCodes_1.StatusCode.NOT_FOUND).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.NOT_FOUND, null, "Review not found"));
        return;
    }
    res.status(StatusCodes_1.StatusCode.OK).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, review, "Review fetched successfully"));
}));
exports.getAuthorDetailByReviewId = (0, errorHandler_2.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const review = yield prisma_1.default.review.findUnique({ where: { id }, select: { authorId: true, authorType: true, } });
    if (!review) {
        res.status(StatusCodes_1.StatusCode.NOT_FOUND).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.NOT_FOUND, null, "Review not found"));
        return;
    }
    res.status(StatusCodes_1.StatusCode.OK).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, review.authorId, "Author ID fetched successfully"));
}));
