import { Router } from "express";
import { createUser, facultyRegister, getFacultyProfile, getMe, getStudentProfile, loginFaculty, loginStudent, loginUser, logOut, studentRegister } from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { authenticateUser } from "../middlewares/auth";


const router = Router();

router.post("/register", createUser)
router.post('/login',loginUser)

router.get('/me',isAuthenticated,getMe)
router.post('/logout',isAuthenticated,logOut)


//student register
router.post('/student/register',studentRegister)
router.post('/student/login',loginStudent)
router.get('/student/profile',authenticateUser,getStudentProfile)

//faculty register
router.post('/faculty/register',facultyRegister)
router.post('/faculty/login',loginFaculty)
router.get('/faculty/profile',authenticateUser,getFacultyProfile)

export default router;
  