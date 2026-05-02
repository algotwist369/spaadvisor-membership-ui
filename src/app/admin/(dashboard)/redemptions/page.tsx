"use client";

import React from "react";
import { BadgeIndianRupee, Check, Copy, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { formatCurrency, formatDate, useDebouncedValue } from "@/lib/admin/utils";
import { useAdminRedemptionsStore } from "@/store/useAdminRedemptionsStore";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStateMessage } from "@/components/admin/AdminStateMessage";
import { AdminSummaryCard } from "@/components/admin/AdminSummaryCard";

const PAGE_SIZE = 10;
const tableHeaders = [
  "Membership",
  "Customer",
  "Service",
  "Plan",
  "Duration",
  "Deducted",
  "Balances",
  "Branch",
  "Centre",
  "Staff",
  "Performed By",
  "Redeemed At",
];
const mobileFieldClassName = "rounded-2xl border border-secondary-100 bg-secondary-50 p-3";

function CopyableId({
  value,
  copiedValue,
  onCopy,
}: {
  value?: string;
  copiedValue?: string | null;
  onCopy: (value: string) => void;
}) {
  if (!value) {
    return <span className="text-sm text-secondary-500">N/A</span>;
  }

  const isCopied = copiedValue === value;

  return (
    <button
      type="button"
      onClick={() => onCopy(value)}
      className="inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-white px-2.5 py-1 text-sm font-medium text-secondary-700 transition hover:border-secondary-300 hover:text-secondary-900"
      title={`Copy ${value}`}
      aria-label={`Copy ${value}`}
    >
      <span className="font-mono">#{value.slice(0, 4)}</span>
      {isCopied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
    </button>
  );
}

export default function AdminRedemptionsPage() {
  const [searchInput, setSearchInput] = React.useState("");
  const search = useDebouncedValue(searchInput, 400);
  const [page, setPage] = React.useState(1);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const { redemptions, totalPages, currentPage, totalItems, isLoading, fetchRedemptions } =
    useAdminRedemptionsStore();
  const getStaffNames = React.useCallback(
    (staffAttending?: Array<{ name?: string }>) =>
      staffAttending?.map((staff) => staff.name).filter(Boolean).join(", ") || "N/A",
    [],
  );
  const formatDuration = React.useCallback(
    (duration?: number) => (duration ? `${duration} min` : "N/A"),
    [],
  );
  const handleCopy = React.useCallback((value: string) => {
    void navigator.clipboard.writeText(value);
    setCopiedId(value);
    window.setTimeout(() => setCopiedId((current) => (current === value ? null : current)), 1500);
  }, []);

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
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <AdminSummaryCard
            icon={BadgeIndianRupee}
            label="Total Redemption Records"
            value={totalItems.toLocaleString()}
            iconClassName="bg-blue-500/10 text-blue-500"
          />

          <div className="w-full xl:w-[520px]">
            <div className="relative">
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
                className="input-field w-full pl-11"
                placeholder="Search by customer, service, mobile, branch, or centre"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <AdminStateMessage message="Loading redemptions..." variant="loading" />
        ) : redemptions.length === 0 ? (
          <AdminStateMessage message="No redemptions found for the current search." />
        ) : (
          <div className="space-y-4">
            <div className="space-y-4 xl:hidden">
              {redemptions.map((redemption, index) => (
                <Card
                  key={redemption._id || `${redemption.mobileNumber}-${index}`}
                  className="overflow-hidden border border-secondary-100 p-0"
                >
                  <div className="border-b border-secondary-100 bg-secondary-50 px-4 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary-400">
                          Redemption
                        </p>
                        <div className="mt-2">
                          <CopyableId
                            value={redemption._id}
                            copiedValue={copiedId}
                            onCopy={handleCopy}
                          />
                        </div>
                        <div className="mt-2 text-sm text-secondary-500">
                          <span>Membership - </span>
                          <CopyableId
                            value={redemption.membershipId}
                            copiedValue={copiedId}
                            onCopy={handleCopy}
                          />
                        </div>
                      </div>
                      <div className="shrink-0 rounded-full bg-red-500/10 px-3 py-1.5 text-sm font-bold text-red-600">
                        {formatCurrency(redemption.deductedAmount)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                    <div className={mobileFieldClassName}>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-400">
                        Customer
                      </p>
                      <p className="mt-2 font-medium text-secondary-900">
                        {redemption.customerName || redemption.mobileNumber || "Customer"}
                      </p>
                      <p className="mt-1 text-sm text-secondary-500">
                        {redemption.mobileNumber || "N/A"}
                      </p>
                    </div>

                    <div className={mobileFieldClassName}>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-400">
                        Service
                      </p>
                      <p className="mt-2 font-medium text-secondary-900">
                        {redemption.serviceName || redemption.serviceId?.name || "Redemption"}
                      </p>
                      <div className="mt-2">
                        <CopyableId
                          value={redemption.serviceId?._id}
                          copiedValue={copiedId}
                          onCopy={handleCopy}
                        />
                      </div>
                    </div>

                    <div className={mobileFieldClassName}>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-400">
                        Plan And Duration
                      </p>
                      <p className="mt-2 font-medium text-secondary-900">
                        {redemption.planName || "Membership"}
                      </p>
                      <p className="mt-1 text-sm text-secondary-500">
                        Duration - {formatDuration(redemption.duration)}
                      </p>
                    </div>

                    <div className={mobileFieldClassName}>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-400">
                        Balance
                      </p>
                      <p className="mt-2 text-sm text-secondary-600">
                        Previous - {formatCurrency(redemption.previousBalance)}
                      </p>
                      <p className="mt-1 text-sm text-secondary-600">
                        New - {formatCurrency(redemption.newBalance)}
                      </p>
                    </div>

                    <div className={mobileFieldClassName}>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-400">
                        Branch
                      </p>
                      <p className="mt-2 font-medium text-secondary-900">
                        {redemption.branchName || redemption.branchId?.name || "N/A"}
                      </p>
                      <div className="mt-2">
                        <CopyableId
                          value={redemption.branchId?._id}
                          copiedValue={copiedId}
                          onCopy={handleCopy}
                        />
                      </div>
                    </div>

                    <div className={mobileFieldClassName}>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-400">
                        Centre
                      </p>
                      <p className="mt-2 font-medium text-secondary-900">
                        {redemption.centreName || redemption.centreId?.name || "N/A"}
                      </p>
                      <div className="mt-2">
                        <CopyableId
                          value={redemption.centreId?._id}
                          copiedValue={copiedId}
                          onCopy={handleCopy}
                        />
                      </div>
                    </div>

                    <div className={mobileFieldClassName}>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-400">
                        Staff
                      </p>
                      <p className="mt-2 text-sm text-secondary-600">
                        {getStaffNames(redemption.staffAttending)}
                      </p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-secondary-400">
                        Performed By
                      </p>
                      <p className="mt-2 font-medium text-secondary-900">
                        {redemption.performedBy?.name || "N/A"}
                      </p>
                      <div className="mt-2">
                        <CopyableId
                          value={redemption.performedBy?._id}
                          copiedValue={copiedId}
                          onCopy={handleCopy}
                        />
                      </div>
                    </div>

                    <div className={mobileFieldClassName}>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-400">
                        Timeline
                      </p>
                      <p className="mt-2 text-sm text-secondary-600">
                        Redeemed - {formatDate(redemption.redeemedAt)}
                      </p>
                    </div>

                    <div className={`${mobileFieldClassName} sm:col-span-2`}>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-400">
                            Region
                          </p>
                          <p className="mt-2 break-all text-sm text-secondary-600">
                            <CopyableId
                              value={redemption.regionId}
                              copiedValue={copiedId}
                              onCopy={handleCopy}
                            />
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-400">
                            Version
                          </p>
                          <p className="mt-2 text-sm text-secondary-600">
                            {redemption.__v ?? "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="hidden xl:block">
              <div className="overflow-x-auto rounded-2xl border border-secondary-100">
                <table className="min-w-full divide-y divide-secondary-100">
                  <thead className="bg-secondary-50">
                    <tr className="text-left text-xs uppercase tracking-[0.2em] text-secondary-400">
                      {tableHeaders.map((header) => (
                        <th key={header} className="px-4 py-4 font-medium">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-100 bg-white">
                    {redemptions.map((redemption, index) => (
                      <tr
                        key={redemption._id || `${redemption.mobileNumber}-${index}`}
                        className="align-top"
                      >
                        <td className="px-4 py-4 text-sm text-secondary-600">
                          <CopyableId
                            value={redemption.membershipId}
                            copiedValue={copiedId}
                            onCopy={handleCopy}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-secondary-900">
                            {redemption.customerName || redemption.mobileNumber || "Customer"}
                          </p>
                          <p className="mt-1 text-sm text-secondary-500">
                            {redemption.mobileNumber || "N/A"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-secondary-900">
                            {redemption.serviceName || redemption.serviceId?.name || "Redemption"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-secondary-900">
                            {redemption.planName || "Membership"}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm text-secondary-600">
                          {formatDuration(redemption.duration)}
                        </td>
                        <td className="px-4 py-4 font-medium text-red-600">
                          {formatCurrency(redemption.deductedAmount)}
                        </td>
                        <td className="px-4 py-4 text-sm text-secondary-600">
                          <p>Prev - {formatCurrency(redemption.previousBalance)}</p>
                          <p className="mt-1">New - {formatCurrency(redemption.newBalance)}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-secondary-900">
                            {redemption.branchName || redemption.branchId?.name || "N/A"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-secondary-900">
                            {redemption.centreName || redemption.centreId?.name || "N/A"}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm text-secondary-600">
                          {getStaffNames(redemption.staffAttending)}
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-secondary-900">
                            {redemption.performedBy?.name || "N/A"}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm text-secondary-600">
                          <p>{formatDate(redemption.redeemedAt)}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
