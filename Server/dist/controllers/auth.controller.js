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
exports.getFacultyProfile = exports.loginFaculty = exports.facultyRegister = exports.getStudentProfile = exports.loginStudent = exports.studentRegister = exports.logOut = exports.getMe = exports.loginUser = exports.createUser = void 0;
const errorHandler_1 = require("../utils/errorHandler");
const prisma_1 = __importDefault(require("../config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const StatusCodes_1 = require("../utils/StatusCodes");
exports.createUser = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
        res.status(StatusCodes_1.StatusCode.BAD_REQUEST).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.BAD_REQUEST, null, "All fields are required"));
        return;
    }
    const existingUser = yield prisma_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        res.status(StatusCodes_1.StatusCode.CONFLICT).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.CONFLICT, null, "User already exists"));
        return;
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield prisma_1.default.user.create({ data: { fullname, email, password: hashedPassword } });
    const createdUser = yield prisma_1.default.user.findUnique({ where: { id: user.id }, select: { id: true, fullname: true, email: true } });
    res.status(StatusCodes_1.StatusCode.CREATED).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.CREATED, createdUser, "User created successfully"));
}));
exports.loginUser = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(StatusCodes_1.StatusCode.BAD_REQUEST).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.BAD_REQUEST, null, "All fields are required"));
        return;
    }
    const user = yield prisma_1.default.user.findUnique({ where: { email } });
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
    const data = yield prisma_1.default.user.findUnique({ where: { id: user.id }, select: { id: true, fullname: true, email: true } });
    res.status(StatusCodes_1.StatusCode.OK).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, Object.assign(Object.assign({}, data), { token }), "Login successful"));
}));
exports.getMe = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(StatusCodes_1.StatusCode.OK).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, req.user, "User fetched successfully"));
}));
exports.logOut = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(StatusCodes_1.StatusCode.OK).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, null, "Logout successful"));
}));
exports.studentRegister = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, email, password, collegeId, enrollment, gender } = req.body;
    if (!fullname || !email || !password || !collegeId || !enrollment || !gender) {
        res.status(StatusCodes_1.StatusCode.BAD_REQUEST).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.BAD_REQUEST, null, "All fields are required"));
        return;
    }
    const existingStudent = yield prisma_1.default.student.findUnique({ where: { email } });
    if (existingStudent) {
        res.status(StatusCodes_1.StatusCode.CONFLICT).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.CONFLICT, null, "Student already exists"));
        return;
    }
    const existingCollege = yield prisma_1.default.college.findUnique({ where: { id: collegeId } });
    if (!existingCollege) {
        res.status(StatusCodes_1.StatusCode.NOT_FOUND).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.NOT_FOUND, null, "College not found"));
        return;
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const student = yield prisma_1.default.student.create({
        data: { fullname, email, password: hashedPassword, college: { connect: { id: collegeId } }, enrollment, gender },
    });
    const registeredStudent = yield prisma_1.default.student.findUnique({ where: { id: student.id }, select: { id: true, fullname: true, email: true, collegeId: true } });
    res.status(StatusCodes_1.StatusCode.CREATED).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.CREATED, registeredStudent, "Student registered successfully"));
}));
exports.loginStudent = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(StatusCodes_1.StatusCode.BAD_REQUEST).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.BAD_REQUEST, null, "All fields are required"));
        return;
    }
    const student = yield prisma_1.default.student.findUnique({ where: { email } });
    if (!student) {
        res.status(StatusCodes_1.StatusCode.NOT_FOUND).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.NOT_FOUND, null, "Student not found"));
        return;
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(password, student.password);
    if (!isPasswordMatch) {
        res.status(StatusCodes_1.StatusCode.UNAUTHORIZED).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.UNAUTHORIZED, null, "Incorrect password"));
        return;
    }
    const token = (0, jsonwebtoken_1.sign)({ id: student.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const data = yield prisma_1.default.student.findUnique({ where: { id: student.id }, select: { id: true, fullname: true, email: true } });
    res.status(StatusCodes_1.StatusCode.OK).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, Object.assign(Object.assign({}, data), { token }), "Login successful"));
}));
exports.getStudentProfile = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.student.findUnique({ where: { id: req.user.id }, select: { id: true, fullname: true, email: true, collegeId: true, enrollment: true, gender: true } });
    res.status(StatusCodes_1.StatusCode.OK).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, user, "User fetched successfully"));
}));
exports.facultyRegister = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, email, password, collegeId, gender } = req.body;
    if (!fullname || !email || !password || !collegeId || !gender) {
        res.status(StatusCodes_1.StatusCode.BAD_REQUEST).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.BAD_REQUEST, null, "All fields are required"));
        return;
    }
    const existingFaculty = yield prisma_1.default.faculty.findUnique({ where: { email } });
    if (existingFaculty) {
        res.status(StatusCodes_1.StatusCode.CONFLICT).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.CONFLICT, null, "Faculty already exists"));
        return;
    }
    const existingCollege = yield prisma_1.default.college.findUnique({ where: { id: collegeId } });
    if (!existingCollege) {
        res.status(StatusCodes_1.StatusCode.NOT_FOUND).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.NOT_FOUND, null, "College not found"));
        return;
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const faculty = yield prisma_1.default.faculty.create({
        data: { fullname, email, password: hashedPassword, gender, college: { connect: { id: collegeId } } }
    });
    const registeredFaculty = yield prisma_1.default.faculty.findUnique({ where: { id: faculty.id }, select: { id: true, fullname: true, email: true, collegeId: true, gender: true } });
    res.status(StatusCodes_1.StatusCode.CREATED).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.CREATED, registeredFaculty, "Faculty registered successfully"));
}));
exports.loginFaculty = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(StatusCodes_1.StatusCode.BAD_REQUEST).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.BAD_REQUEST, null, "All fields are required"));
        return;
    }
    const faculty = yield prisma_1.default.faculty.findUnique({ where: { email } });
    if (!faculty) {
        res.status(StatusCodes_1.StatusCode.NOT_FOUND).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.NOT_FOUND, null, "Faculty not found"));
        return;
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(password, faculty.password);
    if (!isPasswordMatch) {
        res.status(StatusCodes_1.StatusCode.UNAUTHORIZED).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.UNAUTHORIZED, null, "Incorrect password"));
        return;
    }
    const token = (0, jsonwebtoken_1.sign)({ id: faculty.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const data = yield prisma_1.default.faculty.findUnique({ where: { id: faculty.id }, select: { id: true, fullname: true, email: true, gender: true } });
    res.status(StatusCodes_1.StatusCode.OK).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, Object.assign(Object.assign({}, data), { token }), "Login successful"));
}));
exports.getFacultyProfile = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.faculty.findUnique({ where: { id: req.user.id }, select: { id: true, fullname: true, email: true, collegeId: true, gender: true } });
    res.status(StatusCodes_1.StatusCode.OK).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, user, "User fetched successfully"));
}));
