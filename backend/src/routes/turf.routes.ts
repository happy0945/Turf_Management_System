import express from "express"
import { createTurf, getAllTurf, getMyTurfs, getTurfById, updateTurf, deleteTurf, updateStatus } from "../controllers/turf.controller.js";
import userMiddleware from "../middlewares/user.middleware.js";
import adminOrOwnerMiddleware from "../middlewares/adminOrowner.middleware.js";
import ownerMiddleware from "../middlewares/owner.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import { createTurfSchema, listTurfsQuerySchema, turfIdParamSchema, updateTurfSchema, updateTurfStatusSchema } from "../utils/validator/turf.validator.js";
import { uploadTurfImages } from "../middlewares/multer.middleware.js";

const turfRouter = express.Router()

// ─── Public Routes ──────────────────────────────────────────────────────────
turfRouter.get("/", validateRequest(listTurfsQuerySchema), getAllTurf);

// ─── Owner: Get my own turfs (auth required, no turf-id param needed) ───────
turfRouter.get("/my/turfs", userMiddleware, ownerMiddleware, getMyTurfs);

// ─── Public: Get one turf by ID ─────────────────────────────────────────────
turfRouter.get("/:turfId", validateRequest(listTurfsQuerySchema), getTurfById);

// ─── Private: Create turf (admin or owner) ──────────────────────────────────
turfRouter.post("/",
    userMiddleware,
    ownerMiddleware,
    uploadTurfImages.array("images", 6),
    validateRequest(createTurfSchema),
    createTurf
);

// ─── Private: Update turf (admin or the specific turf's owner) ───────────────
turfRouter.patch("/:id",
    userMiddleware,
    adminOrOwnerMiddleware,
    uploadTurfImages.array("images", 6),
    validateRequest(updateTurfSchema),
    updateTurf
);

// ─── Private: Delete turf ────────────────────────────────────────────────────
turfRouter.delete("/:id",
    userMiddleware,
    adminOrOwnerMiddleware,
    validateRequest(turfIdParamSchema),
    deleteTurf
);

// ─── Private: Toggle status ──────────────────────────────────────────────────
turfRouter.patch("/:id/status",
    userMiddleware,
    adminOrOwnerMiddleware,
    validateRequest(updateTurfStatusSchema),
    updateStatus
)

export default turfRouter;
