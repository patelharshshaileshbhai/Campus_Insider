import express, { Request, Response } from "express";
import { ApiResponse, asyncHandler } from "../utils/errorHandler";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { StatusCode } from "../utils/StatusCodes";
// import { Student } from "../types/users";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { User } from "@prisma/client";
export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { fullname, email, password, username, gender } = req.body;

    if (!fullname || !email || !password || !username || !gender) {
        res.status(StatusCode.BAD_REQUEST).json(new ApiResponse(StatusCode.BAD_REQUEST, null, "All fields are required"));
        return;
    }

    let profileUrl: string = "";

    if (req.file) {
        const uploadResponse = await uploadOnCloudinary(req.file.path);
        profileUrl = uploadResponse?.secure_url || "";
    } else {
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        profileUrl = gender === "male" ? boyProfilePic : girlProfilePic;
    }

    const existingUser = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
    if (existingUser) {
        res.status(StatusCode.CONFLICT).json(new ApiResponse(StatusCode.CONFLICT, null, "User already exists"));
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
        data: {
            fullname,
            email,
            password: hashedPassword,
            username,
            gender,
            profileUrl // Ensure profileUrl is always a string
        }
    });

    const token = sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

    const createdUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { id: true, fullname: true, email: true, username: true, gender: true , profileUrl: true}
    });

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
    const userData = await prisma.user.findUnique({ where: { id: user.id }, select: { id: true, fullname: true, email: true, username: true, gender: true , profileUrl: true} });
    
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, { userData, token }, "Login successful"));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    const user=req.user
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK,{user}, "User fetched successfully"));
});

export const logOut = asyncHandler(async (req: Request, res: Response) => {
    
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, null, "Logout successful"));
});

export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as User;
    const token = sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
    const userData = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      username: user.username,
      gender: user.gender,
      profileUrl: user.profileUrl || '',
      authType: 'google',
    //   password: 'oauth2',
    };
  
    // res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, { userData, token }, 'Google login successful'));
    res.redirect(`http://localhost:4200/googleauth?userData=${JSON.stringify(userData)}&token=${token}`);
  });