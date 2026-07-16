import express from "express"
import { createTurf,getAllTurf, getTurfById,updateTurf,deleteTurf} from "../controllers/turf.controller.js";
import userMiddleware from "../middlewares/user.middleware.js";
import adminOrOwnerMiddleware from "../middlewares/adminOrowner.middleware.js";

const turfRouter = express.Router()

// Private routes : only admin and owner can access
turfRouter.post("/",userMiddleware,adminOrOwnerMiddleware,createTurf);
turfRouter.put("/update/:id",userMiddleware,adminOrOwnerMiddleware, updateTurf)
turfRouter.delete("/delete/:id",userMiddleware,adminOrOwnerMiddleware,deleteTurf)

// Public Routes
turfRouter.get("/",getAllTurf);
turfRouter.get("/:id", getTurfById);


