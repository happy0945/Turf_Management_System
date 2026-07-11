import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Request, Response , NextFunction } from "express";
import User from "../models/user.model.js";
import redisClient from "../config/redis.js";

const adminMiddleware = asyncHandler (async (req: Request, res: Response,next:NextFunction)=>{

    const {token} = req.cookies;
    if(!token){
        throw new ApiError(404,"Token is not present")
    }
    const secret = process.env.JWT_SECRET;
    if(!secret){
        throw new ApiError(404,"JWT_SECRET is not defined")
    }
    const payload = jwt.verify(token,secret);

    if(typeof payload === "string"){
        throw new ApiError(404,"invalid token payload")
    }

    const {_id} = payload;
    if(!_id)
    {
        throw new ApiError(404,"Invalid Token")
    }

    const result = await User.findById({_id})
    if(payload.role != "admin")
        throw new ApiError(404,"Access Denied")
    if(!result){
        throw new ApiError(404,"User doesn't exists");

    }
    const isBlocked = await redisClient.exists(`token:${token}`)
    if(isBlocked)
    {
        throw new ApiError(404,"Token not Present");
    }

    req.user = result;

    next();

})

export default adminMiddleware;