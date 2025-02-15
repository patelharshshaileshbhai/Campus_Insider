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
exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const errorHandler_1 = require("../utils/errorHandler");
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json(new errorHandler_1.ApiResponse(401, null, "Unauthorized: No token provided"));
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Check if user is a student
        const student = yield prisma_1.default.student.findUnique({ where: { id: decoded.id } });
        if (student === null || student === void 0 ? void 0 : student.enrollment) {
            req.user = { id: student.id, role: "student" };
            next();
            return;
        }
        // Check if user is a faculty member
        const faculty = yield prisma_1.default.faculty.findUnique({ where: { id: decoded.id } });
        if (faculty) {
            req.user = { id: faculty.id, role: "faculty" };
            next();
            return;
        }
        res.status(404).json(new errorHandler_1.ApiResponse(404, null, "User not found"));
    }
    catch (error) {
        res.status(401).json(new errorHandler_1.ApiResponse(401, null, "Unauthorized: Invalid token"));
    }
});
exports.authenticateUser = authenticateUser;
