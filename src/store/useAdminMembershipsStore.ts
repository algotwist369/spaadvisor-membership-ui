import { create } from "zustand";
import adminApi from "@/lib/api/admin";
import type { AdminMembership, AdminMembershipsState } from "@/types";

interface MembershipResponse {
  memberships?: AdminMembership[];
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
}

export const useAdminMembershipsStore = create<AdminMembershipsState>((set) => ({
  memberships: [],
  totalPages: 1,
  currentPage: 1,
  totalItems: 0,
  isLoading: true,

  fetchMemberships: async ({ page, limit, search, statusFilter }) => {
    set({ isLoading: true });

    try {
      const response = await adminApi.get<MembershipResponse>("/membership/admin/all", {
        params: {
          page,
          limit,
          search,
        },
      });

      const items = response.data.memberships || [];
      const filteredItems =
        statusFilter === "All"
          ? items
          : items.filter((membership) => membership.status === statusFilter);

      set({
        memberships: filteredItems,
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || page,
        totalItems: response.data.totalItems || 0,
        isLoading: false,
      });
    } catch {
      set({
        memberships: [],
        totalPages: 1,
        currentPage: page,
        totalItems: 0,
        isLoading: false,
      });
    }
  },
}));
