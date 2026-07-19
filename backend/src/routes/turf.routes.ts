import express from "express"
import { createTurf,getAllTurf, getTurfById,updateTurf,deleteTurf,updateStatus} from "../controllers/turf.controller.js";
import userMiddleware from "../middlewares/user.middleware.js";
import adminOrOwnerMiddleware from "../middlewares/adminOrowner.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import { createTurfSchema, listTurfsQuerySchema, turfIdParamSchema, updateTurfSchema, updateTurfStatusSchema } from "../utils/validator/turf.validator.js";
import { uploadTurfImages } from "../middlewares/multer.middleware.js";

const turfRouter = express.Router()

// Public Routes
turfRouter.get("/",validateRequest(listTurfsQuerySchema),getAllTurf);
turfRouter.get("/:turfId",validateRequest(listTurfsQuerySchema), getTurfById);


// Private routes : only admin and owner can access
turfRouter.post("/",
    userMiddleware,
    adminOrOwnerMiddleware,
    uploadTurfImages.array("images",6),
    validateRequest(createTurfSchema),
    createTurf
);
turfRouter.patch("/:id",
    userMiddleware,
    adminOrOwnerMiddleware,
    uploadTurfImages.array("images",6),
    validateRequest(updateTurfSchema),
    updateTurf
);

turfRouter.delete("/:id",
    userMiddleware,
    adminOrOwnerMiddleware,
    validateRequest(turfIdParamSchema),
    deleteTurf
);

turfRouter.patch("/:id/status",
    userMiddleware,
    adminOrOwnerMiddleware,
    validateRequest(updateTurfStatusSchema),
    updateStatus

)



export default turfRouter;
