import { create } from "zustand";
import adminApi from "@/lib/api/admin";
import type { AdminRedemption, AdminRedemptionsState } from "@/types";

interface RedemptionResponse {
  redemptions?: AdminRedemption[];
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
}

export const useAdminRedemptionsStore = create<AdminRedemptionsState>((set) => ({
  redemptions: [],
  totalPages: 1,
  currentPage: 1,
  totalItems: 0,
  isLoading: true,

  fetchRedemptions: async ({ page, limit, search }) => {
    set({ isLoading: true });

    try {
      const response = await adminApi.get<RedemptionResponse>("/membership/admin/redemptions", {
        params: {
          page,
          limit,
          search,
        },
      });

      set({
        redemptions: response.data.redemptions || [],
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || page,
        totalItems: response.data.totalItems || 0,
        isLoading: false,
      });
    } catch {
      set({
        redemptions: [],
        totalPages: 1,
        currentPage: page,
        totalItems: 0,
        isLoading: false,
      });
    }
  },
}));
