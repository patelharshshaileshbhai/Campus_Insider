import {verify} from "jsonwebtoken";
import prisma from "../config/prisma";
import {  ApiResponse, asyncHandler } from "../utils/errorHandler";
import { Request, Response, NextFunction } from "express";
import { JwtPayload} from "jsonwebtoken";


declare global {
    namespace Express {
        interface Request {
            user?:any
        }
    }
}

export const isAuthenticated= asyncHandler(async(req,res,next)=>{


    //get token with bearer

    // const token=req.headers.authorization?.split(" ")[1]
    const token= req.header("Authorization")?.replace("Bearer ", "")
    console.log(token);
    if(!token){
       res.status(401).json(new ApiResponse(401,null,"Unauthorized"))
       return
    }

    const decoded=verify(token,process.env.JWT_SECRET as string)
    console.log(decoded);

    if(!decoded){
       res.status(401).json(new ApiResponse(401,null,"Unauthorized"))
       return
    }

    const user=await prisma.user.findUnique({where:{id:(decoded as JwtPayload).id}})

    if(!user){
        res.status(401).json(new ApiResponse(401,null,"Unauthorized"))
        return
    }

    req.user=user

    next();

})