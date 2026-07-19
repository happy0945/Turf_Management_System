import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request, Response , NextFunction } from "express";

const ownerMiddleware = asyncHandler (async (req: Request, res: Response,next:NextFunction)=>{
    
    if(!req.user){
        throw new ApiError(401,"Unauthorized from owner middleware")
    }

    if(req.user.role !== "owner"){
        throw new ApiError(404,"Owner Access only")
    }
    

    next();

})

export default ownerMiddleware;