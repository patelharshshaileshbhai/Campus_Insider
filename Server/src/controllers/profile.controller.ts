import { Request, Response } from "express";
import { asyncHandler } from "../utils/errorHandler";
import { ApiResponse } from "../utils/errorHandler";
import { StatusCode } from "../utils/StatusCodes";
import prisma from "../config/prisma";
import { isNullableType } from "graphql";

export const getMyPosts=asyncHandler(async(req:Request,res:Response):Promise<void>=>{
    const userId=req.user.id
    
    const posts=await prisma.post.findMany({
        where:{
            userId:userId
        },
        select:{
            title:true,
            content:true,
            media:true,
            userId:true,
            numbersOfLikes:true,
            createdAt:true,

        }
    })

    if(posts.length===0 || posts.length==null ){
        res.status(StatusCode.NOT_FOUND).
        json(new ApiResponse(
            StatusCode.NOT_FOUND,
            null,
            "No Posts are found"))
        return
    }
    
    res.status(StatusCode.OK).
    json(new ApiResponse(
        StatusCode.OK,
        posts,
        "Posts of the User Profile"
    ))
})


export const getMyReviews=asyncHandler(async (req:Request,res:Response):Promise<void>=>{

    const userId=req.user.id

    const reviews=await prisma.review.findMany({
        where:{
            userId
        },
        select:{
            title:true,
            content:true,
            imageUrl:true,
            userId:true,
            college:{
                select:{
                    id:true,
                    name:true,
                    location:true,
                    affiliation:true,
                    type:true
                }
            }
        }
    })

    if(reviews.length===0|| reviews.length==null){

        res.status(StatusCode.NOT_FOUND).
        json(new ApiResponse(
            StatusCode.NOT_FOUND,
            null,
            "Reviews are not found"
        ))
        return
    }

    res.status(StatusCode.OK).json(
        new ApiResponse(StatusCode.OK,
            reviews,
            "My Profile Reviews"
        )
    )
})