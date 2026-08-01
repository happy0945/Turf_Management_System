import { Request, Response } from "express";
import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Turf from "../models/turf.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApirResponse.js";

// ================= Add Review =================
export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const turfIdStr = String(req.params.turfId);
  const { rating, comment } = req.body;
  const userId = req.user!._id;

  if (!rating || Number(rating) < 1 || Number(rating) > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  if (!comment || typeof comment !== "string" || comment.trim().length === 0) {
    throw new ApiError(400, "Review comment is required");
  }

  const turf = await Turf.findById(turfIdStr);
  if (!turf) {
    throw new ApiError(404, "Turf not found");
  }

  const turfObjectId = new mongoose.Types.ObjectId(turfIdStr);
  const userObjectId = new mongoose.Types.ObjectId(String(userId));

  // Check if user already reviewed this turf
  const existing = await Review.findOne({ turf: turfObjectId, user: userObjectId });
  if (existing) {
    // Update existing review
    existing.rating = Number(rating);
    existing.comment = comment.trim();
    await existing.save();
  } else {
    // Create new review
    await Review.create({
      turf: turfObjectId,
      user: userObjectId,
      rating: Number(rating),
      comment: comment.trim(),
    });
  }

  // Recalculate average rating & total reviews for the turf
  const allReviews = await Review.find({ turf: turfObjectId });
  const total = allReviews.length;
  const sum = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
  const avgRating = total > 0 ? Number((sum / total).toFixed(1)) : 0;

  turf.rating = avgRating;
  turf.totalReviews = total;
  await turf.save();

  return res.status(201).json(
    new ApiResponse(
      201,
      { rating: avgRating, totalReviews: total },
      "Review submitted successfully"
    )
  );
});

// ================= Get Reviews for Turf =================
export const getTurfReviews = asyncHandler(async (req: Request, res: Response) => {
  const turfIdStr = String(req.params.turfId);
  const turfObjectId = new mongoose.Types.ObjectId(turfIdStr);

  const reviews = await Review.find({ turf: turfObjectId })
    .populate("user", "fullName avatar emailId")
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, reviews, "Reviews fetched successfully")
  );
});

// ================= Get Recent Reviews Across Platform =================
export const getRecentReviews = asyncHandler(async (_req: Request, res: Response) => {
  const reviews = await Review.find()
    .populate("user", "fullName avatar emailId role")
    .populate("turf", "turfName location")
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  return res.status(200).json(
    new ApiResponse(200, reviews, "Recent reviews fetched successfully")
  );
});
