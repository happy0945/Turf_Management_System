import axiosInstance from "../lib/axios";

export interface LoginData {
  emailId: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  emailId: string;
  password: string;
  contactNumber: string;
}

export interface UserProfile {
  _id: string;
  fullName: string;
  emailId: string;
  contactNumber: string;
  role: "user" | "admin" | "owner";
  avatar: string;
}

export const authService = {
  async login(data: LoginData) {
    const res = await axiosInstance.post("/auth/login", data);
    return res.data;
  },

  async register(data: RegisterData) {
    const res = await axiosInstance.post("/auth/register", data);
    return res.data;
  },

  async logout() {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // Even if server call fails, clear local state
    }
  },

  async getProfile(): Promise<UserProfile> {
    const res = await axiosInstance.get("/auth/profile");
    return res.data.data;
  },

  async updateProfile(data: Partial<Pick<UserProfile, "fullName" | "contactNumber" | "avatar">>) {
    const res = await axiosInstance.patch("/auth/profile", data);
    return res.data;
  },
};
