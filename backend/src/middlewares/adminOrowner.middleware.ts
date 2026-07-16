import { Request, Response, NextFunction } from "express";
import Turf from "../models/turf.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const adminOrOwnerMiddleware = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        if(!req.user){
                throw new ApiError(401,"Unauthorized from adminOrOwner middleware")
            }
        

        // Admin can access everything
        if (req.user.role === "admin") {
            return next();
        }

        const turf = await Turf.findById(req.params.id);

        if (!turf) {
            throw new ApiError(404, "Turf not found");
        }

        if (turf.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Access denied");
        }

        next();
    }
);

export default adminOrOwnerMiddleware;