import axiosInstance from "../lib/axios";

export interface ReviewItem {
  _id: string;
  turf: {
    _id: string;
    turfName: string;
    location?: { city: string; address: string };
  };
  user: {
    _id: string;
    fullName: string;
    avatar?: string;
    emailId?: string;
    role?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export const reviewService = {
  // Get recent reviews across all turfs for Home page Testimonials
  async getRecentReviews(): Promise<ReviewItem[]> {
    const res = await axiosInstance.get("/review/recent");
    return res.data.data;
  },

  // Get all real reviews for a specific turf
  async getTurfReviews(turfId: string): Promise<ReviewItem[]> {
    const res = await axiosInstance.get(`/review/turf/${turfId}`);
    return res.data.data;
  },

  // Post or update a review for a turf
  async createReview(
    turfId: string,
    data: { rating: number; comment: string }
  ): Promise<{ rating: number; totalReviews: number }> {
    const res = await axiosInstance.post(`/review/turf/${turfId}`, data);
    return res.data.data;
  },
};
