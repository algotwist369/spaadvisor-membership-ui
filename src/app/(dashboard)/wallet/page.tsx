"use client";

import React from "react";
import { ArrowDownLeft, ArrowUpRight, Calendar, RefreshCw, Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useWalletStore } from "@/store/useWalletStore";

export default function WalletPage() {
  const { balance, transactions, activePlanName, fetchWallet } = useWalletStore();
  const [isLoading, setIsLoading] = React.useState(true)

  const refreshWallet = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchWallet();
    } finally {
      setIsLoading(false);
    }
  }, [fetchWallet]);

  React.useEffect(() => {
    let isActive = true;
    void fetchWallet().finally(() => {
      if (isActive) setIsLoading(false);
    });
    return () => { isActive = false; };
  }, [fetchWallet]);

  return (
    <div className="space-y-6 lg:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-secondary-900">My Wallet</h1>
          <p className="mt-1 lg:mt-2 text-secondary-500 text-sm lg:text-base">
            Track your active balance, current plan, and recent wallet activity.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={refreshWallet}
          isLoading={isLoading}
          className="w-full sm:w-auto min-w-[120px]"
        >
          Refresh
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex items-center gap-4 p-4 lg:p-6">
          <div className="rounded-2xl bg-primary/10 p-3 lg:p-4 text-primary">
            <Wallet size={24} className="lg:w-7 lg:h-7" />
          </div>
          <div>
            <p className="text-xs lg:text-sm font-medium text-secondary-500">Available Balance</p>
            <p className="mt-0.5 lg:mt-1 text-xl lg:text-2xl font-bold text-secondary-900">
              ₹{balance.toLocaleString()}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4 lg:p-6">
          <div className="rounded-2xl bg-blue-500/10 p-3 lg:p-4 text-blue-500">
            <Calendar size={24} className="lg:w-7 lg:h-7" />
          </div>
          <div>
            <p className="text-xs lg:text-sm font-medium text-secondary-500">Active Plan</p>
            <p className="mt-0.5 lg:mt-1 text-lg lg:text-xl font-bold text-secondary-900 truncate max-w-[150px] lg:max-w-none">{activePlanName}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4 lg:p-6 sm:col-span-2 lg:col-span-1">
          <div className="rounded-2xl bg-secondary-100 p-3 lg:p-4 text-secondary-700">
            <RefreshCw size={24} className="lg:w-7 lg:h-7" />
          </div>
          <div>
            <p className="text-xs lg:text-sm font-medium text-secondary-500">Transactions</p>
            <p className="mt-0.5 lg:mt-1 text-xl lg:text-2xl font-bold text-secondary-900">{transactions.length}</p>
          </div>
        </Card>
      </div>

      <Card className="p-4 lg:p-6">
        <div className="mb-6">
          <h2 className="text-lg lg:text-xl font-bold text-secondary-900">Transaction History</h2>
          <p className="mt-1 text-xs lg:text-sm text-secondary-500">
            Credits from memberships and debits from redemptions are shown here.
          </p>
        </div>

        {isLoading ? (
          <div className="py-12 lg:py-16 text-center text-secondary-500 text-sm lg:text-base">Loading wallet data...</div>
        ) : transactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-secondary-200 bg-secondary-50 px-6 py-12 text-center text-secondary-500 text-sm">
            No wallet transactions available yet.
          </div>
        ) : (
          <div className="space-y-3 lg:space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col gap-3 rounded-2xl border border-secondary-100 bg-secondary-50 p-3 lg:p-4 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-secondary-100/50"
              >
                <div className="flex items-start gap-3 lg:gap-4 overflow-hidden">
                  <div
                    className={`rounded-xl p-2.5 lg:p-3 shrink-0 ${
                      transaction.type === "CREDIT"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {transaction.type === "CREDIT" ? (
                      <ArrowUpRight size={18} className="lg:w-5 lg:h-5" />
                    ) : (
                      <ArrowDownLeft size={18} className="lg:w-5 lg:h-5" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium text-secondary-900 text-sm lg:text-base truncate">{transaction.description}</p>
                    <div className="flex flex-col gap-0.5 mt-1">
                      <p className="text-[10px] lg:text-xs text-secondary-400 font-mono">
                        ID: {transaction.id}
                      </p>
                      <p className="text-[10px] lg:text-xs text-secondary-500">
                        {new Date(transaction.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-none border-secondary-100">
                  <p
                    className={`text-base lg:text-lg font-bold ${
                      transaction.type === "CREDIT" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.type === "CREDIT" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-secondary-400">
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
