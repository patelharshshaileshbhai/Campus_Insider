"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.createUser);
router.post('/login', auth_controller_1.loginUser);
router.get('/me', authMiddleware_1.isAuthenticated, auth_controller_1.getMe);
router.post('/logout', authMiddleware_1.isAuthenticated, auth_controller_1.logOut);
//student register
router.post('/student/register', auth_controller_1.studentRegister);
router.post('/student/login', auth_controller_1.loginStudent);
router.get('/student/profile', auth_1.authenticateUser, auth_controller_1.getStudentProfile);
//faculty register
router.post('/faculty/register', auth_controller_1.facultyRegister);
router.post('/faculty/login', auth_controller_1.loginFaculty);
router.get('/faculty/profile', auth_1.authenticateUser, auth_controller_1.getFacultyProfile);
exports.default = router;
