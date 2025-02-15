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
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_1 = __importDefault(require("../config/prisma"));
const errorHandler_1 = require("../utils/errorHandler");
exports.isAuthenticated = (0, errorHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get token with bearer
    var _a;
    // const token=req.headers.authorization?.split(" ")[1]
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    console.log(token);
    if (!token) {
        res.status(401).json(new errorHandler_1.ApiResponse(401, null, "Unauthorized"));
        return;
    }
    const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);
    if (!decoded) {
        res.status(401).json(new errorHandler_1.ApiResponse(401, null, "Unauthorized"));
        return;
    }
    const user = yield prisma_1.default.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
        res.status(401).json(new errorHandler_1.ApiResponse(401, null, "Unauthorized"));
        return;
    }
    req.user = user;
    next();
}));
