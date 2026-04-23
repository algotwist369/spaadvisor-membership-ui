"use client";

import React from "react";
import Link from "next/link";
import { Activity, ArrowRight, BadgeIndianRupee, Shield, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminDashboardPage() {
  const sections = [
    {
      title: "Memberships",
      href: "/admin/memberships",
      icon: Users,
      bg: "bg-primary/10",
      color: "text-primary",
    },
    {
      title: "Redemptions",
      href: "/admin/redemptions",
      icon: BadgeIndianRupee,
      bg: "bg-blue-500/10",
      color: "text-blue-500",
    },
    {
      title: "Activity",
      href: "/admin/transactions",
      icon: Activity,
      bg: "bg-secondary-100",
      color: "text-secondary-700",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Admin Dashboard" title="SpaAdvisor Admin" />

      <Card className="overflow-hidden p-0">
        <div className="flex items-center gap-4 border-b border-secondary-100 bg-primary/5 px-8 py-8">
          <div className="rounded-3xl bg-primary p-4 text-white">
            <Shield size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">Admin Panel</h2>
            <p className="mt-1 text-secondary-500">Manage platform data.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-3">
          {sections.map((section) => (
            <Link key={section.href} href={section.href}>
              <Card hoverable className="flex h-full flex-col">
                <div className={`inline-flex rounded-2xl p-4 ${section.bg} ${section.color}`}>
                  <section.icon size={24} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-secondary-900">{section.title}</h3>
                <div className="mt-4 flex items-center gap-2 text-sm font-bold text-primary">
                  Open
                  <ArrowRight size={16} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
