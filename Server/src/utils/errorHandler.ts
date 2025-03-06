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


// import { Request, Response, NextFunction } from "express";

// const asyncHandler = (fn: Function) => 
//   (req: Request, res: Response, next: NextFunction) => 
//     Promise.resolve(fn(req, res, next)).catch(next);



/*
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
        this.error = process.env.NODE_ENV === "development" ? error : undefined; // Hide stack traces in production
    }
}

// Centralized Async Error Handler Middleware
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error: any) {
            console.error("🔥 Error caught in asyncHandler:", {
                method: req.method,
                path: req.path,
                body: req.body, // Log request body for debugging
                message: error.message,
                stack: error.stack,
                code: error.code || null,
                meta: error.meta || null,
            });

            let statusCode = error.statusCode || 500;
            let message = error.message || "Internal Server Error";
            let errorDetails = process.env.NODE_ENV === "development" ? error.stack : null; // Hide stack traces in production

            // 🔍 Prisma-Specific Error Handling
            if (error.code) {
                switch (error.code) {
                    case "P2025":
                        statusCode = 404;
                        message = "Record not found";
                        break;
                    case "P2002":
                        statusCode = 409;
                        message = "Unique constraint violation";
                        break;
                    case "P2020":
                        statusCode = 400;
                        message = "Value out of range for the column";
                        break;
                    case "P2014":
                        statusCode = 400;
                        message = "Invalid relation in Prisma schema";
                        break;
                    case "P2003":
                        statusCode = 400;
                        message = "Foreign key constraint failed";
                        break;
                    default:
                        statusCode = 500;
                        message = "Database error";
                        break;
                }
            }

            // ✅ Pass error to the next middleware (Express error handler)
            next(new ApiResponse(statusCode, null, message, errorDetails));
        }
    };
};

// Express Error Handler Middleware (Optional)
const errorMiddleware = (err: ApiResponse<any>, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json(err);
};

export { ApiResponse, asyncHandler, errorMiddleware };

*/