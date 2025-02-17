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
exports.logOut = exports.getMe = exports.loginUser = exports.createUser = void 0;
const errorHandler_1 = require("../utils/errorHandler");
const prisma_1 = __importDefault(require("../config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const StatusCodes_1 = require("../utils/StatusCodes");
const cloudinary_1 = require("../utils/cloudinary");
exports.createUser = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, email, password, username, gender } = req.body;
    if (!fullname || !email || !password || !username || !gender) {
        res.status(StatusCodes_1.StatusCode.BAD_REQUEST).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.BAD_REQUEST, null, "All fields are required"));
        return;
    }
    let profileUrl = "";
    if (req.file) {
        const uploadResponse = yield (0, cloudinary_1.uploadOnCloudinary)(req.file.path);
        profileUrl = (uploadResponse === null || uploadResponse === void 0 ? void 0 : uploadResponse.secure_url) || "";
    }
    else {
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        profileUrl = gender === "male" ? boyProfilePic : girlProfilePic;
    }
    const existingUser = yield prisma_1.default.user.findFirst({ where: { OR: [{ username }, { email }] } });
    if (existingUser) {
        res.status(StatusCodes_1.StatusCode.CONFLICT).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.CONFLICT, null, "User already exists"));
        return;
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield prisma_1.default.user.create({
        data: {
            fullname,
            email,
            password: hashedPassword,
            username,
            gender,
            profileUrl // Ensure profileUrl is always a string
        }
    });
    const token = (0, jsonwebtoken_1.sign)({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const createdUser = yield prisma_1.default.user.findUnique({
        where: { id: user.id },
        select: { id: true, fullname: true, email: true, username: true, gender: true, profileUrl: true }
    });
    res.status(StatusCodes_1.StatusCode.CREATED).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.CREATED, { createdUser, token }, "User created successfully"));
}));
exports.loginUser = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //take email or username and password
    const { eou, password } = req.body;
    if (!eou || !password) {
        res.status(StatusCodes_1.StatusCode.BAD_REQUEST).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.BAD_REQUEST, null, "All fields are required"));
        return;
    }
    const user = yield prisma_1.default.user.findFirst({
        where: {
            OR: [{ email: eou }, { username: eou }],
        },
    });
    if (!user) {
        res.status(StatusCodes_1.StatusCode.NOT_FOUND).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.NOT_FOUND, null, "User not found"));
        return;
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatch) {
        res.status(StatusCodes_1.StatusCode.UNAUTHORIZED).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.UNAUTHORIZED, null, "Incorrect password"));
        return;
    }
    const token = (0, jsonwebtoken_1.sign)({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const userData = yield prisma_1.default.user.findUnique({ where: { id: user.id }, select: { id: true, fullname: true, email: true, username: true, gender: true, profileUrl: true } });
    res.status(StatusCodes_1.StatusCode.OK).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, { userData, token }, "Login successful"));
}));
exports.getMe = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.status(StatusCodes_1.StatusCode.OK).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, { user }, "User fetched successfully"));
}));
exports.logOut = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(StatusCodes_1.StatusCode.OK).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, null, "Logout successful"));
}));
