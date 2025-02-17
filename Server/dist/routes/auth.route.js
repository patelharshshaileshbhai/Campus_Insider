"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = (0, express_1.Router)();
router.post("/register", multer_1.default.single('profile'), auth_controller_1.createUser);
router.post("/login", auth_controller_1.loginUser);
router.get("/me", authMiddleware_1.isAuthenticated, auth_controller_1.getMe);
router.post("/logout", authMiddleware_1.isAuthenticated, auth_controller_1.logOut);
exports.default = router;
