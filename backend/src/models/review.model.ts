import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReview extends Document {
  turf: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    turf: {
      type: Schema.Types.ObjectId,
      ref: "Turf",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews from the same user for the same turf (optional, or allow multiple)
reviewSchema.index({ turf: 1, user: 1 }, { unique: true });

const Review = mongoose.model<IReview>("Review", reviewSchema);
export default Review;
