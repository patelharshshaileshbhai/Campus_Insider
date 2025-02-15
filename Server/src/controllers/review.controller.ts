import { AuthRequest } from "../middlewares/auth";
import prisma from "../config/prisma";
import { ApiResponse } from "../utils/errorHandler";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/errorHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { StatusCode } from "../utils/StatusCodes";

export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, content } = req.body;

    // Validate required fields
    if (!title || !content) {
        res.status(StatusCode.BAD_REQUEST).json(new ApiResponse(StatusCode.BAD_REQUEST, null, "Title and content are required"));
        return 
    }

    // Check if user is authenticated
    if (!req.user) {
        res.status(StatusCode.UNAUTHORIZED).json(new ApiResponse(StatusCode.UNAUTHORIZED, null, "Unauthorized"));
        return
    }

    // Validate author role and existence
    let isValidAuthor = false;
    if (req.user.role === "student") {
        const studentExists = await prisma.student.findUnique({ where: { id: req.user.id } });
        if (studentExists) isValidAuthor = true;
    } else if (req.user.role === "faculty") {
        const facultyExists = await prisma.faculty.findUnique({ where: { id: req.user.id } });
        if (facultyExists) isValidAuthor = true;
    }

    if (!isValidAuthor) {
        res.status(StatusCode.BAD_REQUEST).json(new ApiResponse(StatusCode.BAD_REQUEST, null, "Invalid author ID"));
        return
    }

    // Handle file uploads (optional)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // Cast to correct type
    const uploadedImages: string[] = []; // Store URLs of uploaded images

    if (files && files["file"] && files["file"].length > 0) {
        for (const file of files["file"]) {
            const uploadedImage = await uploadOnCloudinary(file.path);
            if (uploadedImage?.secure_url) {
                uploadedImages.push(uploadedImage.secure_url); // Store each uploaded image URL
            }
        }

        // If all uploads fail, return an error
        if (uploadedImages.length === 0) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json(new ApiResponse(StatusCode.INTERNAL_SERVER_ERROR, null, "Failed to upload images"));
            return
        }
    }
   
    let reviewedUser;

    if (req.user.role === "student") {
        reviewedUser = await prisma.student.findUnique({
            where: { id: req.user.id },
            select: {
                fullname: true,
                college: { // Fetching college name
                    select: { name: true }
                }
            }
        });
    } else if (req.user.role === "faculty") {
        reviewedUser = await prisma.faculty.findUnique({
            where: { id: req.user.id },
            select: {
                fullname: true,
                college: { // Fetching college name
                    select: { name: true }
                }
            }
        });
    }
    
   
    

    
        // Create the review with or without images
        const newReview = await prisma.review.create({
            data: {
                title,
                content,
                createdAt: new Date(),
                imageUrl: uploadedImages.length > 0 ? uploadedImages.join(",") : undefined, // Optional field
                authorType: req.user.role === "student" ? "STUDENT" : "FACULTY",
                authorId: req.user.id,
                authorDetail: reviewedUser || {}
            },
        });

       
        res.status(StatusCode.CREATED).json(new ApiResponse(StatusCode.CREATED, newReview, "Review created successfully"));
        return  
    
});


export const getReviews = asyncHandler(async (req: Request, res: Response) => {

    const reviews = await prisma.review.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            imageUrl: true,
            authorType: true,
            authorId:true
        },
    })

    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, reviews, "Reviews fetched successfully"));
     
})

export const getReviewById = asyncHandler(async (req: Request, res: Response) => {

    const {id}=req.params;

    const review = await prisma.review.findUnique({
        where:{id},
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            imageUrl: true,
            authorType: true,
            authorId:true
        },
    })

    if(!review){
        res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "Review not found"));
        return 
    }

    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, review, "Review fetched successfully"));
     
})


export const getAuthorDetailByReviewId=asyncHandler(async(req:Request,res:Response)=>{
    const {id}=req.params;
    const review=await prisma.review.findUnique({where:{id},select:{authorId:true,authorType:true,}})
    if(!review){
        res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "Review not found"));
        return 
    }
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, review.authorId, "Author ID fetched successfully"));
})