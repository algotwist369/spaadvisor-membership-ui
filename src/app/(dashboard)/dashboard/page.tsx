"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Wallet, Calendar, ArrowUpRight, ArrowDownLeft, Sparkles } from 'lucide-react';

import { useWalletStore } from '@/store/useWalletStore';
import { useAuthStore } from '@/store/useAuthStore';

const Dashboard: React.FC = () => {
  const { balance, transactions, activePlanName, fetchWallet } = useWalletStore();
  const { user, fetchMe } = useAuthStore();

  React.useEffect(() => {
    if (user) {
      fetchMe();
      fetchWallet();
    }
  }, [user, fetchWallet, fetchMe]);

  if (!user) return null;

  const stats = [
    {
      label: 'Wallet Balance',
      value: `₹${balance.toLocaleString()}`,
      icon: Wallet,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Active Plan',
      value: activePlanName,
      icon: Calendar,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-secondary-900 mb-2">Welcome back, {user.name}</h1>
        <p className="text-secondary-500 text-sm lg:text-base">Here&apos;s what&apos;s happening with your membership today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="flex items-center gap-4 lg:gap-5 p-4 lg:p-6">
            <div className={`p-3 lg:p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} className="lg:w-7 lg:h-7" />
            </div>
            <div>
              <p className="text-secondary-500 text-xs lg:text-sm font-medium">{stat.label}</p>
              <p className="text-xl lg:text-2xl font-bold text-secondary-900 mt-0.5 lg:mt-1">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg lg:text-xl font-bold text-secondary-900">Recent Transactions</h3>
            <button className="text-primary hover:underline text-sm font-medium">View All</button>
          </div>
          <div className="space-y-3 lg:space-y-4">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 lg:p-4 bg-secondary-50 rounded-xl border border-secondary-100">
                <div className="flex items-center gap-3 lg:gap-4 overflow-hidden">
                  <div className={`p-2 rounded-lg shrink-0 ${tx.type === 'CREDIT' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {tx.type === 'CREDIT' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                  </div>
                  <div className="truncate">
                    <p className="text-secondary-900 font-medium text-sm lg:text-base truncate">{tx.description}</p>
                    <p className="text-secondary-400 text-[10px] lg:text-xs">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className={`font-bold text-sm lg:text-base ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </p>
                  <p className="text-secondary-400 text-[10px] lg:text-xs uppercase tracking-wider">{tx.status}</p>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="text-center py-10 lg:py-12 text-secondary-500 italic text-sm">
                No transactions yet.
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions/Info */}
        <Card className="h-full p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl font-bold text-secondary-900 mb-6">Membership Info</h3>
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="https://res.cloudinary.com/dxpxcptn4/image/upload/v1771596901/lead_funnel/Logo/ueieevrqtlohixofo1fe.png"
                  alt="SpaAdvisor Logo"
                  className="h-5 w-auto"
                />
                <span className="font-bold uppercase tracking-wider text-[10px] lg:text-xs text-primary">Current Plan</span>
              </div>
              <p className="text-xl lg:text-2xl font-bold text-secondary-900">{activePlanName}</p>
              <p className="text-secondary-500 text-xs lg:text-sm mt-1">Exclusive benefits active</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs lg:text-sm font-medium text-secondary-700">Account Summary</p>
              <div className="flex justify-between text-xs lg:text-sm">
                <span className="text-secondary-500">Member Since</span>
                <span className="text-secondary-900 font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between text-xs lg:text-sm">
                <span className="text-secondary-500">Mobile</span>
                <span className="text-secondary-900 font-medium">{user.mobileNumber}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
