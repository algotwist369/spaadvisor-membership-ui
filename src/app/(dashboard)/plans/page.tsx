"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, Star, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { env } from '@/lib/env';
import { useAuthStore } from '@/store/useAuthStore';
import { useWalletStore } from '@/store/useWalletStore';
import type { MembershipPlan } from '@/types';

const Plans: React.FC = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuthStore();
  const { fetchWallet } = useWalletStore();
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/portal/plans');
        setPlans(response.data);
      } catch (err: any) {
        setError('Failed to load membership plans. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePurchase = async (plan: MembershipPlan) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      // 1. Create Purchase Order
      const orderResponse = await api.post('/portal/purchase-order', {
        planId: plan._id,
        clientId: user._id
      });

      const { orderId, amount, currency } = orderResponse.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: amount,
        currency: currency,
        name: 'SpaAdvisor',
        description: `Purchase ${plan.name}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            // 3. Verify Payment
            await api.post('/portal/verify-payment', {
              razorpayOrderId: orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              planId: plan._id,
              clientId: user._id
            });
            
            alert('Membership assigned successfully!');
            await fetchWallet();
            router.push('/dashboard');
          } catch (err) {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          contact: user.mobileNumber
        },
        theme: {
          color: '#008080'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to initialize payment');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="text-primary animate-spin mb-4" size={48} />
        <p className="text-secondary-500 animate-pulse">Fetching exclusive plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-12 bg-red-50 border border-red-100 rounded-3xl">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">Membership Plans</h1>
        <p className="text-secondary-500">Choose the perfect membership to elevate your wellness journey with exclusive benefits and premium access.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan._id} 
            className={`flex flex-col relative ${plan.status === 'Active' ? 'border-primary/20' : 'opacity-50'}`}
            hoverable={plan.status === 'Active'}
          >
            {plan.price > 5000 && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-lg">
                <Star size={14} fill="currentColor" /> Premium
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-secondary-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary">₹{plan.price.toLocaleString()}</span>
                <span className="text-secondary-400 text-sm">/ {plan.validityDays} days</span>
              </div>
            </div>

            <div className="space-y-4 flex-1 mb-8">
              <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-sm font-medium text-primary flex justify-between">
                  <span>Wallet Credit:</span>
                  <span className="font-bold">₹{plan.creditAmount.toLocaleString()}</span>
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-secondary-500 text-sm leading-relaxed">
                  <Check size={18} className="text-primary mt-0.5 shrink-0" />
                  <span>{plan.description}</span>
                </div>
                <div className="flex items-start gap-3 text-secondary-500 text-sm leading-relaxed">
                  <Check size={18} className="text-primary mt-0.5 shrink-0" />
                  <span>Valid for {plan.validityDays} days from date of purchase</span>
                </div>
              </div>
            </div>

            <Button 
              className="w-full py-4 shadow-lg"
              disabled={plan.status !== 'Active'}
              onClick={() => handlePurchase(plan)}
            >
              Purchase Now
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Plans;
