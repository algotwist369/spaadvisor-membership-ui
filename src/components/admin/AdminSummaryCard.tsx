import React from "react";
import type { LucideIcon } from "lucide-react";

interface AdminSummaryCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  iconClassName: string;
}

export const AdminSummaryCard: React.FC<AdminSummaryCardProps> = ({
  icon: Icon,
  value,
  label,
  iconClassName,
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className={`rounded-2xl p-4 ${iconClassName}`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-sm font-medium text-secondary-500">{label}</p>
        <p className="mt-1 text-3xl font-bold text-secondary-900">{value}</p>
      </div>
    </div>
  );
};
