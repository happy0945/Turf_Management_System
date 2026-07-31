import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Middleware that allows access only for users with role "owner" or "admin".
 * Unlike adminOrOwnerMiddleware, this does NOT look up a turf by ID —
 * it is purely role-based and is used for routes like POST /turf and GET /turf/my/turfs.
 */
const ownerMiddleware = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new ApiError(401, "Authentication required.");
        }
        if (req.user.role !== "owner" && req.user.role !== "admin") {
            throw new ApiError(403, "Access denied. Turf Owner or Admin role required.");
        }
        next();
    }
);

export default ownerMiddleware;