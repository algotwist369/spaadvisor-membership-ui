"use client";

import React from "react";
import { Filter, Search, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { formatCurrency, formatDate, useDebouncedValue } from "@/lib/admin/utils";
import { useAdminMembershipsStore } from "@/store/useAdminMembershipsStore";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStateMessage } from "@/components/admin/AdminStateMessage";
import { AdminSummaryCard } from "@/components/admin/AdminSummaryCard";

const PAGE_SIZE = 10;
const statusOptions = ["All", "Active", "Expired", "Cancelled"];
const tableHeaders = ["Customer", "Plan", "Amount", "Wallet", "Status", "Dates", "Payment"];

export default function AdminMembershipsPage() {
  const [searchInput, setSearchInput] = React.useState("");
  const search = useDebouncedValue(searchInput, 400);
  const [page, setPage] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState("All");
  const { memberships, totalPages, currentPage, totalItems, isLoading, fetchMemberships } =
    useAdminMembershipsStore();

  React.useEffect(() => {
    void fetchMemberships({
      page,
      limit: PAGE_SIZE,
      search,
      statusFilter,
    });
  }, [fetchMemberships, page, search, statusFilter]);

  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Membership Administration" title="All Membership Purchases" />

      <Card>
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <AdminSummaryCard
            icon={Users}
            label="Total Membership Records"
            value={totalItems.toLocaleString()}
            iconClassName="bg-primary/10 text-primary"
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px] xl:w-[520px]">
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
                className="input-field pl-11"
                placeholder="Search by customer or mobile"
              />
            </div>
            <div className="relative">
              <Filter
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400"
              />
              <select
                value={statusFilter}
                onChange={(event) => {
                  setPage(1);
                  setStatusFilter(event.target.value);
                }}
                className="input-field appearance-none pl-11"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === "All" ? "All statuses" : status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <AdminStateMessage message="Loading memberships..." variant="loading" />
        ) : memberships.length === 0 ? (
          <AdminStateMessage message="No memberships found for the current search and filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-100">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.2em] text-secondary-400">
                  {tableHeaders.map((header) => (
                    <th
                      key={header}
                      className={`pb-4 font-medium ${header === "Dates" ? "" : "pr-4"}`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {memberships.map((membership, index) => (
                  <tr key={membership._id || `${membership.mobileNumber}-${index}`}>
                    <td className="py-4 pr-4 align-top">
                      <p className="font-medium text-secondary-900">
                        {membership.customerName || "Customer"}
                      </p>
                      <p className="mt-1 text-sm text-secondary-500">{membership.mobileNumber}</p>
                    </td>
                    <td className="py-4 pr-4 align-top">
                      <p className="font-medium text-secondary-900">
                        {membership.planId?.name || "Membership"}
                      </p>
                      <p className="mt-1 text-sm text-secondary-500">
                        {membership.planId?.validityDays || 0} days
                      </p>
                    </td>
                    <td className="py-4 pr-4 font-medium text-secondary-900">
                      {formatCurrency(membership.amountPaid || membership.planId?.price)}
                    </td>
                    <td className="py-4 pr-4 font-medium text-secondary-900">
                      {formatCurrency(membership.walletBalance)}
                    </td>
                    <td className="py-4 pr-4">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                        {membership.status || "Unknown"}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-secondary-500">
                      <p>Start - {formatDate(membership.startDate)}</p>
                      <p className="mt-1">Ends - {formatDate(membership.endDate)}</p>
                    </td>
                    <td className="py-4 text-sm text-secondary-500">
                      <p>Payment Type - {membership.paymentType}</p>
                      <p>Payment Id - {membership.razorpayPaymentId}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
