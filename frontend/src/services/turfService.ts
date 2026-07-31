import axiosInstance from "../lib/axios";

export interface TurfImage {
  url: string;
  public_id: string;
}

export interface TurfLocation {
  type: string;
  coordinates: [number, number];
  address: string;
  city: string;
}

export interface Turf {
  _id: string;
  owner: string | { _id: string; fullName: string; emailId: string };
  turfName: string;
  description: string;
  location: TurfLocation;
  sportsType: string[];
  openingTime: string;
  closingTime: string;
  slotDuration: number;
  pricePerSlot: number;
  amenities: string[];
  images: TurfImage[];
  rating: number;
  totalReviews: number;
  status: "active" | "inactive";
  createdAt: string;
}

export interface TimeSlot {
  startTime: string;
  isAvailable: boolean;
}

export const turfService = {
  async getAllTurfs(): Promise<Turf[]> {
    const res = await axiosInstance.get("/turf");
    return res.data.data;
  },

  async getTurfById(turfId: string): Promise<Turf> {
    const res = await axiosInstance.get(`/turf/${turfId}`);
    return res.data.data;
  },

  async getAvailableSlots(turfId: string, date: string): Promise<TimeSlot[]> {
    const res = await axiosInstance.get(`/booking/turf/${turfId}/slots`, {
      params: { date },
    });
    return res.data.data;
  },
};
