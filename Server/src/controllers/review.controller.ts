
// import prisma from "../config/prisma";
// import { ApiResponse } from "../utils/errorHandler";
// import { Request, Response } from "express";
// import { asyncHandler } from "../utils/errorHandler";
// import { uploadOnCloudinary } from "../utils/cloudinary";
// import { StatusCode } from "../utils/StatusCodes";

// export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
//     const { title, content } = req.body;

//     // Validate required fields
//     if (!title || !content) {
//         res.status(StatusCode.BAD_REQUEST).json(new ApiResponse(StatusCode.BAD_REQUEST, null, "Title and content are required"));
//         return 
//     }

//     // Check if user is authenticated
//     if (!req.user) {
//         res.status(StatusCode.UNAUTHORIZED).json(new ApiResponse(StatusCode.UNAUTHORIZED, null, "Unauthorized"));
//         return
//     }

//     // Validate author role and existence
//     let isValidAuthor = false;
//     if (req.user.role === "student") {
//         const studentExists = await prisma.student.findUnique({ where: { id: req.user.id } });
//         if (studentExists) isValidAuthor = true;
//     } else if (req.user.role === "faculty") {
//         const facultyExists = await prisma.faculty.findUnique({ where: { id: req.user.id } });
//         if (facultyExists) isValidAuthor = true;
//     }

//     if (!isValidAuthor) {
//         res.status(StatusCode.BAD_REQUEST).json(new ApiResponse(StatusCode.BAD_REQUEST, null, "Invalid author ID"));
//         return
//     }

//     // Handle file uploads (optional)
//     const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // Cast to correct type
//     const uploadedImages: string[] = []; // Store URLs of uploaded images

//     if (files && files["file"] && files["file"].length > 0) {
//         for (const file of files["file"]) {
//             const uploadedImage = await uploadOnCloudinary(file.path);
//             if (uploadedImage?.secure_url) {
//                 uploadedImages.push(uploadedImage.secure_url); // Store each uploaded image URL
//             }
//         }

//         // If all uploads fail, return an error
//         if (uploadedImages.length === 0) {
//             res.status(StatusCode.INTERNAL_SERVER_ERROR).json(new ApiResponse(StatusCode.INTERNAL_SERVER_ERROR, null, "Failed to upload images"));
//             return
//         }
//     }
   
//     let reviewedUser;

//     if (req.user.role === "student") {
//         reviewedUser = await prisma.student.findUnique({
//             where: { id: req.user.id },
//             select: {
//                 fullname: true,
//                 college: { // Fetching college name
//                     select: { name: true }
//                 }
//             }
//         });
//     } else if (req.user.role === "faculty") {
//         reviewedUser = await prisma.faculty.findUnique({
//             where: { id: req.user.id },
//             select: {
//                 fullname: true,
//                 college: { // Fetching college name
//                     select: { name: true }
//                 }
//             }
//         });
//     }
    
   
    

    
//         // Create the review with or without images
//         const newReview = await prisma.review.create({
//             data: {
//                 title,
//                 content,
//                 createdAt: new Date(),
//                 imageUrl: uploadedImages.length > 0 ? uploadedImages.join(",") : undefined, // Optional field
//                 authorType: req.user.role === "student" ? "STUDENT" : "FACULTY",
//                 authorId: req.user.id,
//                 authorDetail: reviewedUser || {}
//             },
//         });

       
//         res.status(StatusCode.CREATED).json(new ApiResponse(StatusCode.CREATED, newReview, "Review created successfully"));
//         return  
    
// });


// export const getReviews = asyncHandler(async (req: Request, res: Response) => {

//     const reviews = await prisma.review.findMany({
//         select: {
//             id: true,
//             title: true,
//             content: true,
//             createdAt: true,
//             imageUrl: true,
//             authorType: true,
//             authorId:true
//         },
//     })

//     res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, reviews, "Reviews fetched successfully"));
     
// })

// export const getReviewById = asyncHandler(async (req: Request, res: Response) => {

//     const {id}=req.params;

//     const review = await prisma.review.findUnique({
//         where:{id},
//         select: {
//             id: true,
//             title: true,
//             content: true,
//             createdAt: true,
//             imageUrl: true,
//             authorType: true,
//             authorId:true
//         },
//     })

//     if(!review){
//         res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "Review not found"));
//         return 
//     }

//     res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, review, "Review fetched successfully"));
     
// })


// export const getAuthorDetailByReviewId=asyncHandler(async(req:Request,res:Response)=>{
//     const {id}=req.params;
//     const review=await prisma.review.findUnique({where:{id},select:{authorId:true,authorType:true,}})
//     if(!review){
//         res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "Review not found"));
//         return 
//     }
//     res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, review.authorId, "Author ID fetched successfully"));
// })


import prisma from "../config/prisma";
import { ApiResponse } from "../utils/errorHandler";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/errorHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { StatusCode } from "../utils/StatusCodes";

export const createReview = asyncHandler(async (req: Request, res: Response) => {

    const {collegeId,title, content } = req.body;

    // Validate required fields

    if (!title || !content || !collegeId) {
        res.status(StatusCode.BAD_REQUEST).json(new ApiResponse(StatusCode.BAD_REQUEST, null, "Title and content are required"));
        return 
    }

      
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
    const newReview = await prisma.review.create({
        data: {
            title,
            content,
            createdAt: new Date(),
            imageUrl: uploadedImages.length > 0 ? uploadedImages.join(",") : undefined, // Optional field
            user: {
                connect: {
                    id: req.user.id
                }
            },
            college: {
                connect: {
                    id: collegeId
                }
            }
        },
    });
    res.status(StatusCode.CREATED).json(new ApiResponse(StatusCode.CREATED, newReview, "Review created successfully"));
    return

})


export const createPost = asyncHandler(async (req: Request, res: Response) => {
    const { title, content } = req.body;

    // Validate required fields
console.log(req.body);
    if (!title || !content) {
        res.status(StatusCode.BAD_REQUEST).json(new ApiResponse(StatusCode.BAD_REQUEST, null, "Title and content are required"));
        return 
    }
  
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

    const newPost = await prisma.post.create({
        data: {
            title,
            content,
            createdAt: new Date(),
            media: uploadedImages.length > 0 ? uploadedImages.join(",") : undefined, // Optional field
            user: {
                connect: {
                    id: req.user.id
                }
            }
        },
    });
    res.status(StatusCode.CREATED).json(new ApiResponse(StatusCode.CREATED, newPost, "Post created successfully"));
            

})


export const getAllReviews = asyncHandler(async (req: Request, res: Response) => {

    const reviews = await prisma.review.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            imageUrl: true,
    
            user: {
                select: {
                    id: true,
                    fullname: true,
                    username: true,
                    profileUrl: true
                }
            },
            college: {
                select: {
                    id: true,
                    name: true,
                    location: true,
                    type: true,
                    affiliation: true,
                    reviews: true
                }
            }
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
            user: {
                select: {
                    id: true,
                    fullname: true,
                    username: true,
                    profileUrl: true
                }
            },
            college: {
                select: {
                    id: true,
                    name: true,
                    location: true,
                    type: true,
                    affiliation: true,
                    reviews: true
                }
            }
        },
    })

    if(!review){
        res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "Review not found"));
        return 
    }

    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, review, "Review fetched successfully"));

})

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const {id}=req.params;
    const review=await prisma.review.findUnique({where:{id}})
    if(!review){
        res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "Review not found"));
        return 
    }
   
    const deletedReview=await prisma.review.update({
        where:{id},
        data:{
            isDeleted:true
        }
    })
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, deletedReview, "Review deleted successfully"));
})


export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
    
    const posts = await prisma.post.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            media: true,
            user: {
                select: {
                    id: true,
                    fullname: true,
                    username: true,
                    profileUrl: true
                }
            },
            comments: {
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            fullname: true,
                            username: true,
                            profileUrl: true
                        }
                    }
                }
            },
            likes: {
                select: {
                    id: true,
                    user: {
                        select: {
                            id: true,
                            fullname: true,
                            username: true,
                            profileUrl: true
                        }
                    },
                    number:true
                   

                }
            }
        },
    })

    if(!posts){
        res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "Posts not found"));
        return
    }
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, posts, "Posts fetched successfully"));
})


export const getPostById = asyncHandler(async (req: Request, res: Response) => {
    const {id}=req.params;

    const post = await prisma.post.findUnique({
        where:{id},
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            media: true,
            user: {
                select: {
                    id: true,
                    fullname: true,
                    username: true,
                    profileUrl: true
                }
            },
            comments: {
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            fullname: true,
                            username: true,
                            profileUrl: true
                        }
                    }
                }
            },
            likes: {
                select: {
                    id: true,
                    user: {
                        select: {
                            id: true,
                            fullname: true,
                            username: true,
                            profileUrl: true
                        }
                    },
                    number:true
                   

                }
            }
        },
    })

    if(!post){
        res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "Post not found"));
        return 
    }
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, post, "Post fetched successfully"));
})


export const deletePost = asyncHandler(async (req: Request, res: Response) => {
    const {id}=req.params;
    const post=await prisma.post.findUnique({where:{id}})
    if(!post){
        res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "Post not found"));
        return 
    }
   
    const deletedPost=await prisma.post.update({
        where:{id},
        data:{
            isDeleted:true
        }
    })
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, deletedPost, "Review deleted successfully"));
})