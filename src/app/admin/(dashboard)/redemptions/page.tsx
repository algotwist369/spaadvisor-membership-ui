"use client";

import React from "react";
import { BadgeIndianRupee, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { formatCurrency, formatDate, useDebouncedValue } from "@/lib/admin/utils";
import { useAdminRedemptionsStore } from "@/store/useAdminRedemptionsStore";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStateMessage } from "@/components/admin/AdminStateMessage";
import { AdminSummaryCard } from "@/components/admin/AdminSummaryCard";

const PAGE_SIZE = 10;

export default function AdminRedemptionsPage() {
  const [searchInput, setSearchInput] = React.useState("");
  const search = useDebouncedValue(searchInput, 400);
  const [page, setPage] = React.useState(1);
  const { redemptions, totalPages, currentPage, totalItems, isLoading, fetchRedemptions } =
    useAdminRedemptionsStore();

  React.useEffect(() => {
    void fetchRedemptions({
      page,
      limit: PAGE_SIZE,
      search,
    });
  }, [fetchRedemptions, page, search]);

  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Redemption Administration" title="All Service Redemptions" />

      <Card>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <AdminSummaryCard
            icon={BadgeIndianRupee}
            label="Total Redemption Records"
            value={totalItems.toLocaleString()}
            iconClassName="bg-blue-500/10 text-blue-500"
          />

          <div className="relative lg:w-96">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400"
            />
            <input
              value={searchInput}
              onChange={(event) => {
                setPage(1);
                setSearchInput(event.target.value);
              }}
              className="input-field pl-11"
              placeholder="Search by customer, service, or mobile"
            />
          </div>
        </div>

        {isLoading ? (
          <AdminStateMessage message="Loading redemptions..." variant="loading" />
        ) : redemptions.length === 0 ? (
          <AdminStateMessage message="No redemptions found for the current search." />
        ) : (
          <div className="space-y-4">
            {redemptions.map((redemption, index) => (
              <div
                key={redemption._id || `${redemption.mobileNumber}-${index}`}
                className="rounded-2xl border border-secondary-100 bg-secondary-50 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="font-bold text-secondary-900">
                      {redemption.customerName || redemption.mobileNumber || "Customer"}
                    </p>
                    {[
                      { value: redemption.mobileNumber, className: "mt-1 text-secondary-500" },
                      {
                        value: `Service: ${redemption.serviceId?.name || "Redemption"}`,
                        className: "mt-3 text-secondary-600",
                      },
                      {
                        value: `Plan: ${redemption.planName || "Membership"}`,
                        className: "mt-1 text-secondary-600",
                      },
                    ].map((line, lineIndex) => (
                      <p
                        key={`${redemption._id || index}-${lineIndex}`}
                        className={`text-sm ${line.className}`}
                      >
                        {line.value}
                      </p>
                    ))}
                  </div>
                  <div className="text-left lg:text-right">
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(redemption.deductedAmount)}
                    </p>
                    <p className="mt-1 text-sm text-secondary-500">
                      {formatDate(redemption.redeemedAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}
