import { create } from 'zustand';
import type { WalletState, MembershipPlan, Transaction } from '@/types';
import api from '@/lib/api';
  
export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  transactions: [],
  activePlanName: 'No Active Plan',
  
  // Fetch wallet data from memberships and redemptions
  fetchWallet: async () => {
    try {
      // 1. Fetch Memberships
      const membershipsRes = await api.get('/portal/me/memberships');
      const memberships = Array.isArray(membershipsRes.data) ? membershipsRes.data : (membershipsRes.data?.data || []);
      // console.log('Fetched Memberships:', memberships);
      
      // Calculate total balance from active memberships
      const totalBalance = memberships.reduce((acc: number, m: any) => 
        m.status === 'Active' ? acc + (m.walletBalance || 0) : acc, 0
      );

      // 2. Fetch Redemptions (Transactions)
      const redemptionsRes = await api.get('/portal/me/redemptions');
      const redemptions = Array.isArray(redemptionsRes.data) ? redemptionsRes.data : (redemptionsRes.data?.data || []);
      // console.log('Fetched Redemptions:', redemptions);

      const transactions: Transaction[] = redemptions.map((r: any) => ({
        id: r._id,
        type: 'DEBIT',
        amount: r.deductedAmount,
        description: `Service: ${r.serviceId?.name || 'Redemption'} (${r.planName})`,
        date: r.redeemedAt,
        status: 'COMPLETED'
      }));

      // 3. Add Credits (from memberships)
      const credits: Transaction[] = memberships.map((m: any) => ({
        id: `credit_${m._id}`,
        type: 'CREDIT',
        amount: m.planId?.price || 0,
        description: `Membership Activated: ${m.planId?.name}`,
        date: m.startDate,
        status: 'COMPLETED'
      }));

      // Combine and sort by date
      const allTransactions = [...transactions, ...credits].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Find most recent active membership
      const activeMembership = memberships
        .filter((m: any) => m.status === 'Active')
        .sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];

      set({ 
        balance: totalBalance,
        transactions: allTransactions,
        activePlanName: activeMembership?.planId?.name || 'No Active Plan'
      });
    } catch (error: any) {
      console.error('Failed to fetch wallet data:', error);
    }
  },
  
  addMoney: (amount: number) => {
    const newTransaction: Transaction = {
      id: `tr_${Date.now()}`,
      type: 'CREDIT',
      amount,
      description: 'Wallet Top-up',
      date: new Date().toISOString(),
      status: 'COMPLETED',
    };
    set((state) => ({
      balance: state.balance + amount,
      transactions: [newTransaction, ...state.transactions],
    }));
  },
  purchasePlan: (plan: MembershipPlan) => {
    const newTransaction: Transaction = {
      id: `tr_${Date.now()}`,
      type: 'DEBIT',
      amount: plan.price,
      description: `Membership Purchase: ${plan.name}`,
      date: new Date().toISOString(),
      status: 'COMPLETED',
    };
    set((state) => ({
      balance: state.balance - plan.price,
      transactions: [newTransaction, ...state.transactions],
    }));
  },
}));
