"use client";

import React from "react";
import { Activity, CreditCard, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate, useDebouncedValue } from "@/lib/admin/utils";
import { useAdminTransactionsStore } from "@/store/useAdminTransactionsStore";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStateMessage } from "@/components/admin/AdminStateMessage";
import { AdminSummaryCard } from "@/components/admin/AdminSummaryCard";

const limitOptions = [10, 20, 50, 100];

export default function AdminTransactionsPage() {
  const [searchInput, setSearchInput] = React.useState("");
  const search = useDebouncedValue(searchInput, 300).toLowerCase();
  const [limit, setLimit] = React.useState(10);
  const { transactions, isLoading, fetchTransactions } = useAdminTransactionsStore();

  React.useEffect(() => {
    void fetchTransactions(limit);
  }, [fetchTransactions, limit]);

  const filteredTransactions = transactions.filter((transaction) => {
    if (!search) {
      return true;
    }

    return [transaction.type, transaction.name, transaction.details, transaction.mobileNumber]
      .join(" ")
      .toLowerCase()
      .includes(search);
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Transaction Administration" title="Recent Activity Feed" />

      <Card>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <AdminSummaryCard
            icon={Activity}
            label="Loaded Activity Items"
            value={transactions.length.toLocaleString()}
            iconClassName="bg-secondary-100 text-secondary-700"
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_160px] lg:w-[520px]">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400"
              />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="input-field pl-11"
                placeholder="Search activity"
              />
            </div>
            <select
              value={String(limit)}
              onChange={(event) => setLimit(Number(event.target.value))}
              className="input-field appearance-none"
            >
              {limitOptions.map((option) => (
                <option key={option} value={option}>
                  {option} items
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <AdminStateMessage message="Loading activity feed..." variant="loading" />
        ) : filteredTransactions.length === 0 ? (
          <AdminStateMessage message="No transactions found for the current search." />
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="rounded-2xl border border-secondary-100 bg-secondary-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">{transaction.details}</p>
                      <p className="mt-1 text-sm text-secondary-500">
                        {transaction.name} | {transaction.mobileNumber}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                    {transaction.type}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-secondary-500">{formatDate(transaction.date)}</span>
                  <span className="font-bold text-secondary-900">
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
