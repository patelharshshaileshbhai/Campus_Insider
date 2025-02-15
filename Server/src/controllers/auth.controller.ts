import express, { Request, Response } from "express";
import { ApiResponse, asyncHandler } from "../utils/errorHandler";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { StatusCode } from "../utils/StatusCodes";
import { Student } from "../types/student";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        res.status(StatusCode.BAD_REQUEST).json(new ApiResponse(StatusCode.BAD_REQUEST, null, "All fields are required"));
        return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        res.status(StatusCode.CONFLICT).json(new ApiResponse(StatusCode.CONFLICT, null, "User already exists"));
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { fullname, email, password: hashedPassword } });

    const createdUser = await prisma.user.findUnique({ where: { id: user.id }, select: { id: true, fullname: true, email: true } });
    res.status(StatusCode.CREATED).json(new ApiResponse(StatusCode.CREATED, createdUser, "User created successfully"));
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(StatusCode.BAD_REQUEST).json(new ApiResponse(StatusCode.BAD_REQUEST, null, "All fields are required"));
        return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "User not found"));
        return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        res.status(StatusCode.UNAUTHORIZED).json(new ApiResponse(StatusCode.UNAUTHORIZED, null, "Incorrect password"));
        return;
    }

    const token = sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
    const data = await prisma.user.findUnique({ where: { id: user.id }, select: { id: true, fullname: true, email: true } });
    
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, { ...data, token }, "Login successful"));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, req.user, "User fetched successfully"));
});

export const logOut = asyncHandler(async (req: Request, res: Response) => {
    
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, null, "Logout successful"));
});

export const studentRegister: express.RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { fullname, email, password, collegeId, enrollment, gender }: Student = req.body;

    if (!fullname || !email || !password || !collegeId || !enrollment || !gender) {
        res.status(StatusCode.BAD_REQUEST).json(new ApiResponse(StatusCode.BAD_REQUEST, null, "All fields are required"));
        return;
    }

    const existingStudent = await prisma.student.findUnique({ where: { email } });
    if (existingStudent) {
        res.status(StatusCode.CONFLICT).json(new ApiResponse(StatusCode.CONFLICT, null, "Student already exists"));
        return;
    }

    const existingCollege = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!existingCollege) {
        res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "College not found"));
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await prisma.student.create({
        data: { fullname, email, password: hashedPassword, college: { connect: { id: collegeId } }, enrollment, gender },
    });

    const registeredStudent = await prisma.student.findUnique({ where: { id: student.id }, select: { id: true, fullname: true, email: true, collegeId: true } });
    res.status(StatusCode.CREATED).json(new ApiResponse(StatusCode.CREATED, registeredStudent, "Student registered successfully"));
});

export const loginStudent = asyncHandler(async (req: Request, res: Response) => {
    const {email,password}=req.body;

    if (!email || !password) {
        res.status(StatusCode.BAD_REQUEST).json(new ApiResponse(StatusCode.BAD_REQUEST, null, "All fields are required"));
        return;
    }

    const student = await prisma.student.findUnique({ where: { email } });
    if (!student) {
        res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "Student not found"));
        return;
    }

    const isPasswordMatch = await bcrypt.compare(password, student.password);
    if (!isPasswordMatch) {
        res.status(StatusCode.UNAUTHORIZED).json(new ApiResponse(StatusCode.UNAUTHORIZED, null, "Incorrect password"));
        return;
    }

    const token = sign({ id: student.id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
    const data = await prisma.student.findUnique({ where: { id: student.id }, select: { id: true, fullname: true, email: true } });
    
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, { ...data, token }, "Login successful"));
})

export const getStudentProfile = asyncHandler(async (req: Request, res: Response) => {
    
    const user=await prisma.student.findUnique({where:{id:req.user.id},select:{id:true,fullname:true,email:true,collegeId:true,enrollment:true,gender:true}})
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, user, "User fetched successfully"));
})


export const facultyRegister: express.RequestHandler = asyncHandler(async (req: Request, res: Response) => {

    const {fullname,email,password,collegeId,gender}=req.body;

    if (!fullname || !email || !password || !collegeId || !gender) {
        res.status(StatusCode.BAD_REQUEST).json(new ApiResponse(StatusCode.BAD_REQUEST, null, "All fields are required"));
        return;
    }

    const existingFaculty = await prisma.faculty.findUnique({ where: { email } });
    if (existingFaculty) {
        res.status(StatusCode.CONFLICT).json(new ApiResponse(StatusCode.CONFLICT, null, "Faculty already exists"));
        return;
    }

    const existingCollege = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!existingCollege) {
        res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "College not found"));
        return;
    }     
     
     const hashedPassword=await bcrypt.hash(password,10);
     const faculty=await prisma.faculty.create({
        data:{fullname,email,password:hashedPassword,gender,college:{connect:{id:collegeId}}}
     })

     const registeredFaculty = await prisma.faculty.findUnique({ where: { id: faculty.id }, select: { id: true, fullname: true, email: true, collegeId: true, gender: true } });
    res.status(StatusCode.CREATED).json(new ApiResponse(StatusCode.CREATED, registeredFaculty, "Faculty registered successfully"));


})

export const loginFaculty=asyncHandler(async(req:Request,res:Response)=>{
    const {email,password}=req.body;

    if (!email || !password) {        
        res.status(StatusCode.BAD_REQUEST).json(new ApiResponse(StatusCode.BAD_REQUEST, null, "All fields are required"));
        return;
    }

    const faculty = await prisma.faculty.findUnique({ where: { email } });
    if (!faculty) {
        res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "Faculty not found"));
        return;
    }

    const isPasswordMatch = await bcrypt.compare(password, faculty.password);
    if (!isPasswordMatch) {
        res.status(StatusCode.UNAUTHORIZED).json(new ApiResponse(StatusCode.UNAUTHORIZED, null, "Incorrect password"));
        return;
    }

    const token = sign({ id: faculty.id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
    const data = await prisma.faculty.findUnique({ where: { id: faculty.id }, select: { id: true, fullname: true, email: true ,gender:true} });
    
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, { ...data, token }, "Login successful"));
})

export const getFacultyProfile=asyncHandler(async(req:Request,res:Response)=>{
    const user=await prisma.faculty.findUnique({where:{id:req.user.id},select:{id:true,fullname:true,email:true,collegeId:true,gender:true}})
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, user, "User fetched successfully"));
})
