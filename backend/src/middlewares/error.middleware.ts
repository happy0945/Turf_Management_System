import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("========== ERROR ==========");
  console.error(err);
  console.error("===========================");

  // Multer Errors
  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // MongoDB Duplicate Key Error (E11000)
  if (err.code === 11000 || err.name === "MongoServerError") {
    const keyPattern = err.keyPattern || err.keyValue || {};
    let field = Object.keys(keyPattern)[0] || "field";
    let message = "A record with this information already exists.";

    if (field === "contactNumber") {
      message = "This contact number is already registered to another account.";
    } else if (field === "emailId") {
      message = "This email address is already registered to another account.";
    }

    return res.status(409).json({
      success: false,
      message,
    });
  }

  // Custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      data: err.data,
      stack:
        process.env.NODE_ENV === "development"
          ? err.stack
          : undefined,
    });
  }

  // Unknown Errors
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack:
      process.env.NODE_ENV === "development"
        ? err.stack
        : undefined,
  });
};