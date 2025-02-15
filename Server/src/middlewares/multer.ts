import multer, { Multer, diskStorage } from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";

// Extend Express Request type to include file property
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

// Define upload directory outside `src`
const uploadPath = path.join(__dirname, "..", "uploads");

// Ensure the directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configure storage
const storage = diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, uploadPath); // Save to `uploads` directory
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

// Create upload middleware
const upload: Multer = multer({ storage });

export default upload;
