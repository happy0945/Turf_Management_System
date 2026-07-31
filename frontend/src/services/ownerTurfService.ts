import axiosInstance from "../lib/axios";
import type { Turf } from "./turfService";

export interface CreateTurfData {
  turfName: string;
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  sportsType: string[];
  openingTime: string;
  closingTime: string;
  slotDuration: number;
  pricePerSlot: number;
  amenities: string[];
  images: File[];
}

export const ownerTurfService = {
  // Get all turfs owned by the logged-in owner
  async getMyTurfs(): Promise<Turf[]> {
    const res = await axiosInstance.get("/turf/my/turfs");
    return res.data.data;
  },

  // Create a new turf (multipart/form-data)
  async createTurf(data: CreateTurfData): Promise<Turf> {
    const formData = new FormData();
    formData.append("turfName", data.turfName);
    formData.append("description", data.description);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("latitude", String(data.latitude));
    formData.append("longitude", String(data.longitude));
    formData.append("openingTime", data.openingTime);
    formData.append("closingTime", data.closingTime);
    formData.append("slotDuration", String(data.slotDuration));
    formData.append("pricePerSlot", String(data.pricePerSlot));

    data.sportsType.forEach((s) => formData.append("sportsType", s));
    data.amenities.forEach((a) => formData.append("amenities", a));
    data.images.forEach((img) => formData.append("images", img));

    const res = await axiosInstance.post("/turf", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  // Update an existing turf (multipart/form-data for image upload)
  async updateTurf(
    turfId: string,
    data: Partial<Omit<CreateTurfData, "images">> & {
      images?: File[];
      removeImagesId?: string[];
    }
  ): Promise<Turf> {
    const formData = new FormData();
    if (data.turfName) formData.append("turfName", data.turfName);
    if (data.description) formData.append("description", data.description);
    if (data.address) formData.append("address", data.address);
    if (data.city) formData.append("city", data.city);
    if (data.openingTime) formData.append("openingTime", data.openingTime);
    if (data.closingTime) formData.append("closingTime", data.closingTime);
    if (data.slotDuration) formData.append("slotDuration", String(data.slotDuration));
    if (data.pricePerSlot) formData.append("pricePerSlot", String(data.pricePerSlot));
    if (data.sportsType) data.sportsType.forEach((s) => formData.append("sportsType", s));
    if (data.amenities) data.amenities.forEach((a) => formData.append("amenities", a));
    if (data.images) data.images.forEach((img) => formData.append("images", img));
    if (data.removeImagesId) {
      data.removeImagesId.forEach((id) => formData.append("removeImagesId", id));
    }

    const res = await axiosInstance.patch(`/turf/${turfId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  // Delete a turf
  async deleteTurf(turfId: string): Promise<void> {
    await axiosInstance.delete(`/turf/${turfId}`);
  },

  // Update turf status (active/inactive)
  async updateTurfStatus(turfId: string, status: "active" | "inactive"): Promise<Turf> {
    const res = await axiosInstance.patch(`/turf/${turfId}/status`, { status });
    return res.data.data;
  },
};
