import { Request, Response } from "express";
import { asyncHandler } from "../utils/errorHandler";
import { ApiResponse } from "../utils/errorHandler";
import { StatusCode } from "../utils/StatusCodes";
import prisma from "../config/prisma";
import { uploadOnCloudinary } from "../utils/cloudinary";

export const createReel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { caption} = req.body;
  const userId = req.user?.id; // From auth middleware
  const file = req.file; // From Multer

  // Validate required fields
  if ( !file || !userId) {
    res
      .status(StatusCode.BAD_REQUEST)
      .json(
        new ApiResponse(
          StatusCode.BAD_REQUEST,
          null,
           "video file, and user authentication are required"
        )
      );
    return;
  }

  // Upload video to Cloudinary
  const uploadedVideo = await uploadOnCloudinary(file.path);
  if (!uploadedVideo?.secure_url) {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json(
        new ApiResponse(
          StatusCode.INTERNAL_SERVER_ERROR,
          null,
          "Failed to upload video to Cloudinary"
        )
      );
    return;
  }

  // Create reel in database
  const newReel = await prisma.reel.create({
    data: {
      caption,
      videoUrl: uploadedVideo.secure_url,
      publicId: uploadedVideo.public_id,
      user: {
        connect: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      caption: true,
      videoUrl: true,
      publicId: true,
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

  res
    .status(StatusCode.CREATED)
    .json(
      new ApiResponse(StatusCode.CREATED, newReel, "Reel created successfully")
    );
});

export const getReels = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Fetch reels with pagination
  const [reels, total] = await Promise.all([
    prisma.reel.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc", // Newest first
      },
      skip,
      take: limit,
      select: {
        id: true,
        caption: true,
        videoUrl: true,
        publicId: true,
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
    }),
    prisma.reel.count({
      where: {
        isDeleted: false,
      },
    }),
  ]);

  if (!reels || reels.length === 0) {
    res
      .status(StatusCode.NOT_FOUND)
      .json(new ApiResponse(StatusCode.NOT_FOUND, null, "No reels found"));
    return;
  }

  res.status(StatusCode.OK).json(
    new ApiResponse(StatusCode.OK, {
      reels,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }, "Reels fetched successfully")
  );
});