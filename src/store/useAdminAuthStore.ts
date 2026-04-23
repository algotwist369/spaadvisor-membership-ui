import { create } from "zustand";
import type { AdminAuthState } from "@/types";
import adminApi from "@/lib/api/admin";

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: unknown } } }).response?.data?.message ===
      "string"
  ) {
    return (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("adminUser") || "null")
      : null,
  token: typeof window !== "undefined" ? localStorage.getItem("adminToken") : null,
  role: typeof window !== "undefined" ? localStorage.getItem("adminRole") : null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("adminToken") : false,

  requestOtp: async (mobileNumber: string) => {
    try {
      await adminApi.post("/users/login/request-otp", { mobileNumber });
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Failed to send admin OTP"));
    }
  },

  verifyOtp: async (mobileNumber: string, otp: string) => {
    try {
      const response = await adminApi.post("/users/login/verify-otp", { mobileNumber, otp });
      const { token, user, role } = response.data;

      if (role !== "ADDHEAD") {
        throw new Error("This account is not authorized for the admin dashboard");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminUser", JSON.stringify(user || null));
        localStorage.setItem("adminRole", role);
      }

      set({
        user: user || null,
        token,
        role,
        isAuthenticated: true,
      });
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Invalid OTP"));
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminRole");
    }

    set({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
    });
  },
}));
