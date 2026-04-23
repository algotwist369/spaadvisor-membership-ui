import { create } from "zustand";
import adminApi from "@/lib/api/admin";
import type { AdminTransactionsState, AdminTransaction } from "@/types";

export const useAdminTransactionsStore = create<AdminTransactionsState>((set) => ({
  transactions: [],
  isLoading: true,

  fetchTransactions: async (limit: number) => {
    set({ isLoading: true });

    try {
      const response = await adminApi.get<AdminTransaction[]>("/membership/admin/transactions", {
        params: { limit },
      });

      set({
        transactions: Array.isArray(response.data) ? response.data : [],
        isLoading: false,
      });
    } catch {
      set({
        transactions: [],
        isLoading: false,
      });
    }
  },
}));
