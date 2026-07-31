import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authService, type UserProfile } from "../services/authService";

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (emailId: string, password: string) => Promise<{ role: string }>;
  register: (data: {
    fullName: string;
    emailId: string;
    password: string;
    contactNumber: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("authUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("authToken")
  );
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = !!token && !!user;

  // Sync to localStorage whenever user/token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
      // Also set legacy keys so Navbar/other components still work
      localStorage.setItem("userName", user.fullName);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userToken", token || "");
    } else {
      localStorage.removeItem("authUser");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userToken");
    }
  }, [user, token]);

  const login = async (emailId: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login({ emailId, password });
      const { user: userData, token: authToken } = res.data;
      setToken(authToken);
      setUser(userData);
      return { role: userData.role };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    fullName: string;
    emailId: string;
    password: string;
    contactNumber: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      const { user: userData, token: authToken } = res.data;
      setToken(authToken);
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch {
      // If profile fetch fails, user session is likely invalid
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, isLoading, login, register, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
