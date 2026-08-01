import { Router } from "express";
import userMiddleware from "../middlewares/user.middleware.js";
import { createReview, getTurfReviews, getRecentReviews } from "../controllers/review.controller.js";

const reviewRouter = Router();

// Public: Get recent platform reviews for Home page
reviewRouter.get("/recent", getRecentReviews);

// Public: Get reviews for a specific turf
reviewRouter.get("/turf/:turfId", getTurfReviews);

// Private: Post a review for a turf
reviewRouter.post("/turf/:turfId", userMiddleware, createReview);

export default reviewRouter;
