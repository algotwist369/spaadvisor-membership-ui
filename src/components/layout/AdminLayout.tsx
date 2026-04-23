"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role } = useAdminAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated || role !== "ADDHEAD") {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, role, router]);

  if (typeof window === "undefined" || !isAuthenticated || role !== "ADDHEAD") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-dark">
      <AdminSidebar />
      <main className="ml-72 flex-1 p-8">
        <div className="mx-auto max-w-7xl animate-fade-in">{children}</div>
      </main>
    </div>
  );
};
