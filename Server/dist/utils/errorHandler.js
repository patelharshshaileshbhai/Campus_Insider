"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.ApiResponse = void 0;
// Generic API Response Wrapper
class ApiResponse {
    constructor(statusCode, data, message = "Success", error = null) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        this.error = error;
    }
}
exports.ApiResponse = ApiResponse;
// Improved Async Error Handler Middleware
const asyncHandler = (fn) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield fn(req, res, next);
        }
        catch (error) {
            console.error("Error caught in asyncHandler:", error);
            let statusCode = error.statusCode || 500;
            let message = error.message || "Internal Server Error";
            let errorDetails = error.meta || error.stack || null;
            // Prisma-specific error handling
            if (error.code === "P2025") {
                statusCode = 404;
                message = "Record not found";
            }
            else if (error.code === "P2002") {
                statusCode = 409;
                message = "Unique constraint violation";
            }
            else if (error.code === "P2020") {
                statusCode = 400;
                message = "Value out of range for the column";
            }
            res.status(statusCode).json(new ApiResponse(statusCode, null, message, errorDetails));
        }
    });
};
exports.asyncHandler = asyncHandler;
