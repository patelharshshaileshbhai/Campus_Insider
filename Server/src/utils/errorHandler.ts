import { Request, Response, NextFunction } from "express";

// Generic API Response Wrapper
class ApiResponse<T> {
    public statusCode: number;
    public data: T | null;
    public message: string;
    public success: boolean;
    public error?: any;

    constructor(statusCode: number, data: T | null, message = "Success", error: any = null) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        this.error = error;
    }
}

// Improved Async Error Handler Middleware
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error: any) {
            console.error("Error caught in asyncHandler:", error);
            let statusCode = error.statusCode || 500;
            let message = error.message || "Internal Server Error";
            let errorDetails = error.meta || error.stack || null;

            // Prisma-specific error handling
            if (error.code === "P2025") {
                statusCode = 404;
                message = "Record not found";
            } else if (error.code === "P2002") {
                statusCode = 409;
                message = "Unique constraint violation";
            } else if (error.code === "P2020") {
                statusCode = 400;
                message = "Value out of range for the column";
            }

            res.status(statusCode).json(new ApiResponse(statusCode, null, message, errorDetails));
        }
    };
};

export { ApiResponse, asyncHandler };
