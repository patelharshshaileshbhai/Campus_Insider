import prisma from "../config/prisma";
import { ApiResponse } from "../utils/errorHandler";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/errorHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { StatusCode } from "../utils/StatusCodes";
import { connect } from "http2";
import { realpathSync } from "fs";

export const createReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { collegeId, title, content } = req.body;

    // Validate required fields

    if (!title || !content || !collegeId) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json(
          new ApiResponse(
            StatusCode.BAD_REQUEST,
            null,
            "Title and content are required"
          )
        );
      return;
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
        res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            new ApiResponse(
              StatusCode.INTERNAL_SERVER_ERROR,
              null,
              "Failed to upload images"
            )
          );
        return;
      }
    }
    const newReview = await prisma.review.create({
      data: {
        title,
        content,
        createdAt: new Date(),
        imageUrl:
          uploadedImages.length > 0 ? uploadedImages.join(",") : undefined, // Optional field
        user: {
          connect: {
            id: req.user.id,
          },
        },
        college: {
          connect: {
            id: collegeId,
          },
        },
      },
    });
    res
      .status(StatusCode.CREATED)
      .json(
        new ApiResponse(
          StatusCode.CREATED,
          newReview,
          "Review created successfully"
        )
      );
    return;
  }
);

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { title, content } = req.body;

  // Validate required fields
  console.log(req.body);
  if (!title || !content) {
    res
      .status(StatusCode.BAD_REQUEST)
      .json(
        new ApiResponse(
          StatusCode.BAD_REQUEST,
          null,
          "Title and content are required"
        )
      );
    return;
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
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            StatusCode.INTERNAL_SERVER_ERROR,
            null,
            "Failed to upload images"
          )
        );
      return;
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
          id: req.user.id,
        },
      },
    },
  });
  res
    .status(StatusCode.CREATED)
    .json(
      new ApiResponse(StatusCode.CREATED, newPost, "Post created successfully")
    );
});

export const getAllReviews = asyncHandler(
  async (req: Request, res: Response) => {
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
            profileUrl: true,
          },
        },
        college: {
          select: {
            id: true,
            name: true,
            location: true,
            type: true,
            affiliation: true,
            reviews: true,
          },
        },
      },
    });

    res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(StatusCode.OK, reviews, "Reviews fetched successfully")
      );
  }
);

export const getReviewById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
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
            profileUrl: true,
          },
        },
        college: {
          select: {
            id: true,
            name: true,
            location: true,
            type: true,
            affiliation: true,
            reviews: true,
          },
        },
      },
    });

    if (!review) {
      res
        .status(StatusCode.NOT_FOUND)
        .json(new ApiResponse(StatusCode.NOT_FOUND, null, "Review not found"));
      return;
    }

    res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(StatusCode.OK, review, "Review fetched successfully")
      );
  }
);

export const deleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      res
        .status(StatusCode.NOT_FOUND)
        .json(new ApiResponse(StatusCode.NOT_FOUND, null, "Review not found"));
      return;
    }

    const deletedReview = await prisma.review.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
    res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          deletedReview,
          "Review deleted successfully"
        )
      );
  }
);

export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc", // ✅ Sort posts from newest to oldest
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        media: true,
        numbersOfLikes: true,
        user: {
          select: {
            id: true,
            fullname: true,
            username: true,
            profileUrl: true,
          }
        }
      }
    });
  
    if (!posts || posts.length === 0) {
      res
        .status(StatusCode.NOT_FOUND)
        .json(new ApiResponse(StatusCode.NOT_FOUND, null, "No posts found"));
      return;
    }
  
    res
      .status(StatusCode.OK)
      .json(new ApiResponse(StatusCode.OK, posts, "Posts fetched successfully"));
  });
  
export const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await prisma.post.findUnique({
    where: { id },
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
          profileUrl: true,
        },
      },
      numbersOfLikes: true,
    },
  });

  if (!post) {
    res
      .status(StatusCode.NOT_FOUND)
      .json(new ApiResponse(StatusCode.NOT_FOUND, null, "Post not found"));
    return;
  }
  res
    .status(StatusCode.OK)
    .json(new ApiResponse(StatusCode.OK, post, "Post fetched successfully"));
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({ where: { id }});
  if (!post) {
    res
      .status(StatusCode.NOT_FOUND)
      .json(new ApiResponse(StatusCode.NOT_FOUND, null, "Post not found"));
    return;
  }

  const deletedPost = await prisma.post.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });
  res
    .status(StatusCode.OK)
    .json(
      new ApiResponse(StatusCode.OK, deletedPost, "Review deleted successfully")
    );
});

export const addLike = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.body;
  const userId = req.user?.id; // Assuming `req.user` contains authenticated user

  if (!userId) {
    res
      .status(StatusCode.UNAUTHORIZED)
      .json(new ApiResponse(StatusCode.UNAUTHORIZED, null, "Unauthorized"));
    return;
  }

  // Check if the post exists
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    res
      .status(StatusCode.NOT_FOUND)
      .json(new ApiResponse(StatusCode.NOT_FOUND, null, "Post not found"));
    return;
  }

  // Check if the user has already liked the post
  const existingLike = await prisma.like.findFirst({
    where: { userId, postId },
  });

  if (existingLike) {
    res
      .status(StatusCode.CONFLICT)
      .json(
        new ApiResponse(
          StatusCode.CONFLICT,
          null,
          "You have already liked this post"
        )
      );
    return;
  }

  // Update the like count in the post
  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      numbersOfLikes: post.numbersOfLikes + 1, // ✅ Corrected update statement
    },
  });

  // Add a like entry
  const liked = await prisma.like.create({
    // data: { userId, postId },
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      post: {
        connect: {
          id: postId,
        },
      },
    },
  });

  res
    .status(StatusCode.CREATED)
    .json(
      new ApiResponse(
        StatusCode.CREATED,
        { liked, numbersOfLikes: updatedPost.numbersOfLikes },
        "Post liked successfully"
      )
    );
});

export const addComment = asyncHandler(
  async (req: Request, res: Response) => {
    
    const {postId,content}=req.body
    const userId=req.user?.id

    if(!postId || !content){

        res.status(StatusCode.BAD_REQUEST)
        .json(new ApiResponse(StatusCode.BAD_REQUEST,null,"All fields are  required"))
        return
    }

    if (!userId) {
        res
          .status(StatusCode.UNAUTHORIZED)
          .json(new ApiResponse(StatusCode.UNAUTHORIZED, null, "Unauthorized"));
        return;
      }
    
      // Check if the post exists
      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (!post) {
        res
          .status(StatusCode.NOT_FOUND)
          .json(new ApiResponse(StatusCode.NOT_FOUND, null, "Post not found"));
        return;
      }

      const comment=await prisma.comment.create({
         data:{
            user:{
                connect:{
                    id:userId ,
                }
            },
            post:{
                connect:{
                    id:postId
                }
            },
            content
         }
      })

     
  res
  .status(StatusCode.CREATED)
  .json(
    new ApiResponse(
      StatusCode.CREATED,
      { comment},
      "Post liked successfully"
    )
  );

  });

  export const getAllCommentOfPost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;
  
    // Check if post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "Post not found"));
      return;
    }
  
    // Fetch comments for the post, ordered from latest to oldest
    const comments = await prisma.comment.findMany({
      where: { 
        postId:postId
     },
      orderBy: { createdAt: "desc" }, // ✅ Sort comments from latest to oldest
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            fullname: true,
            username: true,
            profileUrl: true,
          },
        },
      },
    });
  
    if (!comments || comments.length === 0) {
      res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "No comments found"));
      return;
    }
  
    res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, comments, "Comments fetched successfully"));
  });
  
export const getAllLikes=asyncHandler(async (req: Request, res: Response) => {

  const {postId}=req.params

  if(!postId){

    res.status(StatusCode.BAD_REQUEST)
    .json(new ApiResponse(StatusCode.BAD_REQUEST,null,"All fields are  required"))
    return
  }

  const likes=await prisma.like.findMany({
    where:{postId:postId},
    select:{
      id:true,
      user: {
        select: {
          id: true,
          fullname: true,
          username: true,
          profileUrl: true,
        },
      },
      post:{
        select:{
          id:true,
          title:true,
        
      }
    }
  }
  })
  res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK,likes,"Likes fetched successfully"))

})