import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Request, Response , NextFunction } from "express";
import User from "../models/user.model.js";
import redisClient from "../config/redis.js";

const userMiddleware = asyncHandler (async (req: Request, res: Response,next:NextFunction)=>{

    // Support both cookie-based AND Authorization header (Bearer token)
    let token: string | undefined = req.cookies?.token;

    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
    }

    if(!token){
        throw new ApiError(401,"Authentication required. Please login.")
    }
    const secret = process.env.JWT_SECRET;
    if(!secret){
        throw new ApiError(500,"JWT_SECRET is not defined")
    }
    
    let payload: any;
    try {
        payload = jwt.verify(token, secret);
    } catch (err) {
        throw new ApiError(401, "Invalid or expired token. Please login again.");
    }

    if(typeof payload === "string" || !payload._id){
        throw new ApiError(401,"Invalid token payload")
    }

    const result = await User.findById(payload._id)
    if(!result){
        throw new ApiError(404,"User not found");
    }

    // Check if token has been blacklisted (logged out)
    const isBlocked = await redisClient.exists(`token:${token}`)
    if(isBlocked)
    {
        throw new ApiError(401,"Session expired. Please login again.");
    }

    req.user = result;
    next();

})

export default userMiddleware