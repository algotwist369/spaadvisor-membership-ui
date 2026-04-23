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
      if (isActive) {
        setIsLoading(false);
      }
    });

    return () => {
      isActive = false;
    };
  }, [fetchWallet]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">My Wallet</h1>
          <p className="mt-2 text-secondary-500">
            Track your active balance, current plan, and recent wallet activity.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={refreshWallet}
          isLoading={isLoading}
          className="min-w-36"
        >
          Refresh
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="flex items-center gap-4">
          <div className="rounded-2xl bg-primary/10 p-4 text-primary">
            <Wallet size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-500">Available Balance</p>
            <p className="mt-1 text-2xl font-bold text-secondary-900">
              Rs. {balance.toLocaleString()}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-500">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-500">Active Plan</p>
            <p className="mt-1 text-xl font-bold text-secondary-900">{activePlanName}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-2xl bg-secondary-100 p-4 text-secondary-700">
            <RefreshCw size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-500">Transactions</p>
            <p className="mt-1 text-2xl font-bold text-secondary-900">{transactions.length}</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-secondary-900">Transaction History</h2>
            <p className="mt-1 text-sm text-secondary-500">
              Credits from memberships and debits from redemptions are shown here.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-secondary-500">Loading wallet data...</div>
        ) : transactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-secondary-200 bg-secondary-50 px-6 py-12 text-center text-secondary-500">
            No wallet transactions available yet.
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col gap-4 rounded-2xl border border-secondary-100 bg-secondary-50 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-xl p-3 ${
                      transaction.type === "CREDIT"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {transaction.type === "CREDIT" ? (
                      <ArrowUpRight size={20} />
                    ) : (
                      <ArrowDownLeft size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">{transaction.description}</p>
                    <p className="mt-1 text-sm text-secondary-500">
                      Transaction Id: {transaction.id}
                    </p>
                    <p className="mt-1 text-sm text-secondary-500">
                      {new Date(transaction.date).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <p
                    className={`text-lg font-bold ${
                      transaction.type === "CREDIT" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.type === "CREDIT" ? "+" : "-"}Rs.{" "}
                    {transaction.amount.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-secondary-400">
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
