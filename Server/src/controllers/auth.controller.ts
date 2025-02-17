import express, { Request, Response } from "express";
import { ApiResponse, asyncHandler } from "../utils/errorHandler";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { StatusCode } from "../utils/StatusCodes";
import { Student } from "../types/student";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { fullname, email, password,username,gender } = req.body;

    if (!fullname || !email || !password || !username || !gender) {
        res.status(StatusCode.BAD_REQUEST).json(new ApiResponse(StatusCode.BAD_REQUEST, null, "All fields are required"));
        return;
    }

    //existing user by username or email
    const existingUser = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
    if (existingUser) {
        res.status(StatusCode.CONFLICT).json(new ApiResponse(StatusCode.CONFLICT, null, "User already exists"));
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { fullname, email, password: hashedPassword, username,gender } });
    const token = sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
    const createdUser = await prisma.user.findUnique({ where: { id: user.id }, select: { id: true, fullname: true, email: true, username: true, gender: true } });

   
    res.status(StatusCode.CREATED).json(new ApiResponse(StatusCode.CREATED, { createdUser, token }, "User created successfully"));
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {

    //take email or username and password
    const { eou, password } = req.body;




    if (!eou || !password) {
        res.status(StatusCode.BAD_REQUEST).json(new ApiResponse(StatusCode.BAD_REQUEST, null, "All fields are required"));
        return;
    }

    const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: eou }, { username: eou }],
        },
      });
  

      if(!user){
        res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "User not found"));
        return;
      }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        res.status(StatusCode.UNAUTHORIZED).json(new ApiResponse(StatusCode.UNAUTHORIZED, null, "Incorrect password"));
        return;
    }

    const token = sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
    const userData = await prisma.user.findUnique({ where: { id: user.id }, select: { id: true, fullname: true, email: true, username: true, gender: true } });
    
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, { userData, token }, "Login successful"));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, req.user, "User fetched successfully"));
});

export const logOut = asyncHandler(async (req: Request, res: Response) => {
    
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, null, "Logout successful"));
});

