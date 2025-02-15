import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { ApiResponse } from "../utils/errorHandler";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: "student" | "faculty";
    };
}

export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json(new ApiResponse(401, null, "Unauthorized: No token provided"));
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        // Check if user is a student
        const student = await prisma.student.findUnique({ where: { id: decoded.id } });
        if (student?.enrollment) {
            req.user = { id: student.id, role: "student" };
            next();
            return;
        }

        // Check if user is a faculty member
        const faculty = await prisma.faculty.findUnique({ where: { id: decoded.id } });
        if (faculty) {
            req.user = { id: faculty.id, role: "faculty" };
            next();
            return;
        }

        res.status(404).json(new ApiResponse(404, null, "User not found"));
    } catch (error) {
        res.status(401).json(new ApiResponse(401, null, "Unauthorized: Invalid token"));
    }
};
