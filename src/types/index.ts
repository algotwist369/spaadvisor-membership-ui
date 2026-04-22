export interface User {
  createdAt: any;
  _id: string;
  name: string;
  mobileNumber: string;
  walletBalance?: number;
  points?: number;
  activePlan?: MembershipPlan;
}

export interface MembershipPlan {
  _id: string;
  name: string;
  price: number;
  validityDays: number;
  creditAmount: number;
  description: string;
  status: string;
}

export interface Transaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  requestOtp: (name: string, mobileNumber: string) => Promise<void>;
  verifyOtp: (name: string, mobileNumber: string, otp: string) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
}

export interface WalletState {
  balance: number;
  transactions: Transaction[];
  activePlanName: string;
  fetchWallet: () => Promise<void>;
  addMoney: (amount: number) => void;
  purchasePlan: (plan: MembershipPlan) => void;
}


export const _types = true;
