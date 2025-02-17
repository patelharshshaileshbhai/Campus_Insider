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
exports.getAllCommentOfPost = exports.addComment = exports.addLike = exports.deletePost = exports.getPostById = exports.getAllPosts = exports.deleteReview = exports.getReviewById = exports.getAllReviews = exports.createPost = exports.createReview = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const errorHandler_1 = require("../utils/errorHandler");
const errorHandler_2 = require("../utils/errorHandler");
const cloudinary_1 = require("../utils/cloudinary");
const StatusCodes_1 = require("../utils/StatusCodes");
exports.createReview = (0, errorHandler_2.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collegeId, title, content } = req.body;
    // Validate required fields
    if (!title || !content || !collegeId) {
        res
            .status(StatusCodes_1.StatusCode.BAD_REQUEST)
            .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.BAD_REQUEST, null, "Title and content are required"));
        return;
    }
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
            res
                .status(StatusCodes_1.StatusCode.INTERNAL_SERVER_ERROR)
                .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.INTERNAL_SERVER_ERROR, null, "Failed to upload images"));
            return;
        }
    }
    const newReview = yield prisma_1.default.review.create({
        data: {
            title,
            content,
            createdAt: new Date(),
            imageUrl: uploadedImages.length > 0 ? uploadedImages.join(",") : undefined, // Optional field
            user: {
                connect: {
                    id: req.user.id,
                },
            },
            college: {
                connect: {
                    id: collegeId,
                },
            },
        },
    });
    res
        .status(StatusCodes_1.StatusCode.CREATED)
        .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.CREATED, newReview, "Review created successfully"));
    return;
}));
exports.createPost = (0, errorHandler_2.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    // Validate required fields
    console.log(req.body);
    if (!title || !content) {
        res
            .status(StatusCodes_1.StatusCode.BAD_REQUEST)
            .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.BAD_REQUEST, null, "Title and content are required"));
        return;
    }
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
            res
                .status(StatusCodes_1.StatusCode.INTERNAL_SERVER_ERROR)
                .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.INTERNAL_SERVER_ERROR, null, "Failed to upload images"));
            return;
        }
    }
    const newPost = yield prisma_1.default.post.create({
        data: {
            title,
            content,
            createdAt: new Date(),
            media: uploadedImages.length > 0 ? uploadedImages.join(",") : undefined, // Optional field
            user: {
                connect: {
                    id: req.user.id,
                },
            },
        },
    });
    res
        .status(StatusCodes_1.StatusCode.CREATED)
        .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.CREATED, newPost, "Post created successfully"));
}));
exports.getAllReviews = (0, errorHandler_2.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield prisma_1.default.review.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            imageUrl: true,
            user: {
                select: {
                    id: true,
                    fullname: true,
                    username: true,
                    profileUrl: true,
                },
            },
            college: {
                select: {
                    id: true,
                    name: true,
                    location: true,
                    type: true,
                    affiliation: true,
                    reviews: true,
                },
            },
        },
    });
    res
        .status(StatusCodes_1.StatusCode.OK)
        .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, reviews, "Reviews fetched successfully"));
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
            user: {
                select: {
                    id: true,
                    fullname: true,
                    username: true,
                    profileUrl: true,
                },
            },
            college: {
                select: {
                    id: true,
                    name: true,
                    location: true,
                    type: true,
                    affiliation: true,
                    reviews: true,
                },
            },
        },
    });
    if (!review) {
        res
            .status(StatusCodes_1.StatusCode.NOT_FOUND)
            .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.NOT_FOUND, null, "Review not found"));
        return;
    }
    res
        .status(StatusCodes_1.StatusCode.OK)
        .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, review, "Review fetched successfully"));
}));
exports.deleteReview = (0, errorHandler_2.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const review = yield prisma_1.default.review.findUnique({ where: { id } });
    if (!review) {
        res
            .status(StatusCodes_1.StatusCode.NOT_FOUND)
            .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.NOT_FOUND, null, "Review not found"));
        return;
    }
    const deletedReview = yield prisma_1.default.review.update({
        where: { id },
        data: {
            isDeleted: true,
        },
    });
    res
        .status(StatusCodes_1.StatusCode.OK)
        .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, deletedReview, "Review deleted successfully"));
}));
exports.getAllPosts = (0, errorHandler_2.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield prisma_1.default.post.findMany({
        orderBy: {
            createdAt: "desc", // ✅ Sort posts from newest to oldest
        },
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            media: true,
            numbersOfLikes: true,
            user: {
                select: {
                    id: true,
                    fullname: true,
                    username: true,
                    profileUrl: true,
                },
            },
            comments: {
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            fullname: true,
                            username: true,
                            profileUrl: true,
                        },
                    },
                },
            },
            likes: {
                select: {
                    id: true,
                    user: {
                        select: {
                            id: true,
                            fullname: true,
                            username: true,
                            profileUrl: true,
                        },
                    },
                },
            },
        },
    });
    if (!posts || posts.length === 0) {
        res
            .status(StatusCodes_1.StatusCode.NOT_FOUND)
            .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.NOT_FOUND, null, "No posts found"));
        return;
    }
    res
        .status(StatusCodes_1.StatusCode.OK)
        .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, posts, "Posts fetched successfully"));
}));
exports.getPostById = (0, errorHandler_2.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield prisma_1.default.post.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            media: true,
            user: {
                select: {
                    id: true,
                    fullname: true,
                    username: true,
                    profileUrl: true,
                },
            },
            comments: {
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            fullname: true,
                            username: true,
                            profileUrl: true,
                        },
                    },
                },
            },
            likes: {
                select: {
                    id: true,
                    user: {
                        select: {
                            id: true,
                            fullname: true,
                            username: true,
                            profileUrl: true,
                        },
                    },
                },
            },
            numbersOfLikes: true,
        },
    });
    if (!post) {
        res
            .status(StatusCodes_1.StatusCode.NOT_FOUND)
            .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.NOT_FOUND, null, "Post not found"));
        return;
    }
    res
        .status(StatusCodes_1.StatusCode.OK)
        .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, post, "Post fetched successfully"));
}));
exports.deletePost = (0, errorHandler_2.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield prisma_1.default.post.findUnique({ where: { id } });
    if (!post) {
        res
            .status(StatusCodes_1.StatusCode.NOT_FOUND)
            .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.NOT_FOUND, null, "Post not found"));
        return;
    }
    const deletedPost = yield prisma_1.default.post.update({
        where: { id },
        data: {
            isDeleted: true,
        },
    });
    res
        .status(StatusCodes_1.StatusCode.OK)
        .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, deletedPost, "Review deleted successfully"));
}));
exports.addLike = (0, errorHandler_2.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { postId } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming `req.user` contains authenticated user
    if (!userId) {
        res
            .status(StatusCodes_1.StatusCode.UNAUTHORIZED)
            .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.UNAUTHORIZED, null, "Unauthorized"));
        return;
    }
    // Check if the post exists
    const post = yield prisma_1.default.post.findUnique({ where: { id: postId } });
    if (!post) {
        res
            .status(StatusCodes_1.StatusCode.NOT_FOUND)
            .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.NOT_FOUND, null, "Post not found"));
        return;
    }
    // Check if the user has already liked the post
    const existingLike = yield prisma_1.default.like.findFirst({
        where: { userId, postId },
    });
    if (existingLike) {
        res
            .status(StatusCodes_1.StatusCode.CONFLICT)
            .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.CONFLICT, null, "You have already liked this post"));
        return;
    }
    // Update the like count in the post
    const updatedPost = yield prisma_1.default.post.update({
        where: { id: postId },
        data: {
            numbersOfLikes: post.numbersOfLikes + 1, // ✅ Corrected update statement
        },
    });
    // Add a like entry
    const liked = yield prisma_1.default.like.create({
        data: { userId, postId },
    });
    res
        .status(StatusCodes_1.StatusCode.CREATED)
        .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.CREATED, { liked, numbersOfLikes: updatedPost.numbersOfLikes }, "Post liked successfully"));
}));
exports.addComment = (0, errorHandler_2.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { postId, content } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!postId || !content) {
        res.status(StatusCodes_1.StatusCode.BAD_REQUEST)
            .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.BAD_REQUEST, null, "All fields are  required"));
        return;
    }
    if (!userId) {
        res
            .status(StatusCodes_1.StatusCode.UNAUTHORIZED)
            .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.UNAUTHORIZED, null, "Unauthorized"));
        return;
    }
    // Check if the post exists
    const post = yield prisma_1.default.post.findUnique({ where: { id: postId } });
    if (!post) {
        res
            .status(StatusCodes_1.StatusCode.NOT_FOUND)
            .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.NOT_FOUND, null, "Post not found"));
        return;
    }
    const comment = yield prisma_1.default.comment.create({
        data: {
            user: {
                connect: {
                    id: userId,
                }
            },
            post: {
                connect: {
                    id: postId
                }
            },
            content
        }
    });
    res
        .status(StatusCodes_1.StatusCode.CREATED)
        .json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.CREATED, { comment }, "Post liked successfully"));
}));
exports.getAllCommentOfPost = (0, errorHandler_2.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    // Check if post exists
    const post = yield prisma_1.default.post.findUnique({ where: { id: postId } });
    if (!post) {
        res.status(StatusCodes_1.StatusCode.NOT_FOUND).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.NOT_FOUND, null, "Post not found"));
        return;
    }
    // Fetch comments for the post, ordered from latest to oldest
    const comments = yield prisma_1.default.comment.findMany({
        where: {
            postId: postId
        },
        orderBy: { createdAt: "desc" }, // ✅ Sort comments from latest to oldest
        select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
                select: {
                    id: true,
                    fullname: true,
                    username: true,
                    profileUrl: true,
                },
            },
        },
    });
    if (!comments || comments.length === 0) {
        res.status(StatusCodes_1.StatusCode.NOT_FOUND).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.NOT_FOUND, null, "No comments found"));
        return;
    }
    res.status(StatusCodes_1.StatusCode.OK).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, comments, "Comments fetched successfully"));
}));
