"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, BadgeIndianRupee, LogOut, Shield, Users } from "lucide-react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, role } = useAdminAuthStore();

  const menuItems = [
    { icon: Shield, label: "Overview", path: "/admin/dashboard" },
    { icon: Users, label: "Memberships", path: "/admin/memberships" },
    { icon: BadgeIndianRupee, label: "Redemptions", path: "/admin/redemptions" },
    { icon: Activity, label: "Recent Activity", path: "/admin/transactions" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <div className="fixed left-0 top-0 flex h-screen w-72 flex-col border-r border-secondary-200 bg-white p-6">
      <div className="mb-10 rounded-3xl bg-primary/5 p-5">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">SpaAdvisor Membership</p>
        <p className="mt-2 text-sm text-secondary-500">
          {user?.name || user?.mobileNumber || "Admin"} ({role || "ADDHEAD"})
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-secondary-600 hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 rounded-2xl px-4 py-3 text-secondary-500 transition-all duration-300 hover:bg-red-50 hover:text-red-500"
      >
        <LogOut size={20} />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
};
