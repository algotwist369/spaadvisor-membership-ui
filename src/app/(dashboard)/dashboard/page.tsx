"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Wallet, Trophy, Calendar, ArrowUpRight, ArrowDownLeft, Sparkles } from 'lucide-react';

import { useWalletStore } from '@/store/useWalletStore';
import { useAuthStore } from '@/store/useAuthStore';

const Dashboard: React.FC = () => {
  const { balance, transactions, activePlanName, fetchWallet } = useWalletStore();
  const { user, fetchMe } = useAuthStore();

  React.useEffect(() => {
    if (user) {
      // Initial fetch
      fetchMe();
      fetchWallet();

      // Set up polling interval (every 30 seconds)
      /*
      const interval = setInterval(() => {
        fetchMe();
        fetchWallet();
      }, 30000);

      return () => clearInterval(interval);
      */
    }
  }, [user, fetchWallet, fetchMe]);
  // console.log(user);
  // console.log(transactions);
  if (!user) return null;

  const stats = [
    {
      label: 'Wallet Balance',
      value: `₹${balance.toLocaleString()}`,
      icon: Wallet,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    // {
    //   label: 'Reward Points',
    //   value: '0', // Rewards not explicitly in the new API docs yet
    //   icon: Trophy,
    //   color: 'text-yellow-500',
    //   bg: 'bg-yellow-500/10',
    // },
    {
      label: 'Active Plan',
      value: activePlanName,
      icon: Calendar,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Welcome back, {user.name}</h1>
        <p className="text-secondary-500">Here's what's happening with your membership today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-secondary-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-secondary-900 mt-1">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-secondary-900">Recent Transactions</h3>
            <button className="text-primary hover:underline text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl border border-secondary-100">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${tx.type === 'CREDIT' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {tx.type === 'CREDIT' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                  </div>
                  <div>
                    <p className="text-secondary-900 font-medium">{tx.description}</p>
                    <p className="text-secondary-400 text-xs">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </p>
                  <p className="text-secondary-400 text-xs uppercase tracking-wider">{tx.status}</p>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="text-center py-12 text-secondary-500 italic">
                No transactions yet.
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions/Info */}
        <Card className="h-full">
          <h3 className="text-xl font-bold text-secondary-900 mb-6">Membership Info</h3>
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src="https://res.cloudinary.com/dxpxcptn4/image/upload/v1771596901/lead_funnel/Logo/ueieevrqtlohixofo1fe.png" 
                  alt="SpaAdvisor Logo" 
                  className="h-5 w-auto"
                />
                <span className="font-bold uppercase tracking-wider text-xs text-primary">Current Plan</span>
              </div>
              <p className="text-2xl font-bold text-secondary-900">{activePlanName}</p>
              <p className="text-secondary-500 text-sm mt-1">Exclusive benefits active</p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-medium text-secondary-700">Account Summary</p>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-500">Member Since</span>
                <span className="text-secondary-900 font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
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
