import { create } from 'zustand';
import type { AuthState } from '@/types';
import api from '@/lib/api';

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,

  requestOtp: async (name: string, mobileNumber: string) => {
    try {
      await api.post('/portal/request-otp', { name, mobileNumber });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  },

  verifyOtp: async (name: string, mobileNumber: string, otp: string) => {
    try {
      const response = await api.post('/portal/verify-otp', { name, mobileNumber, otp });
      const { token, client } = response.data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(client));
      }
      
      set({ 
        user: client, 
        token, 
        isAuthenticated: true 
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Invalid OTP');
    }
  },

  fetchMe: async () => {
    try {
      const response = await api.get('/portal/me');
      const userData = response.data?.data || response.data;
      set({ user: userData });
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
