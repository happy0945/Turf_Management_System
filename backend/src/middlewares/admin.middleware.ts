import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request, Response , NextFunction } from "express";


const adminMiddleware = asyncHandler (async (req: Request, res: Response,next:NextFunction)=>{

    if(!req.user){
            throw new ApiError(401,"Unauthorized from admin middleware")
        }
    
    if(req.user.role != "admin"){

        throw new ApiError(404,"Admin access only")
    }
    next();

})

export default adminMiddleware;