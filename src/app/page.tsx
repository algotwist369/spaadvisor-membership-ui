"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, Star, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import type { MembershipPlan } from '@/types';

export default function Landing() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/portal/plans');
        setPlans(response.data);
      } catch (err) {
        console.error('Failed to load plans:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const scrollToPlans = () => {
    document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-white to-white">
        <h1 className="text-6xl md:text-8xl font-bold text-secondary-900 mb-8 leading-tight">
          Experience Premium <br />
          <span className="text-primary italic">Wellness</span>
        </h1>
        <p className="text-xl text-secondary-500 max-w-2xl mb-12 leading-relaxed">
          Join India&apos;s most exclusive spa membership platform. <br />
          Discover tranquility and rejuvenation at your fingertips.
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <Link 
            href="/login" 
            className="btn-primary px-10 py-4 text-lg flex items-center justify-center"
          >
            Explore Dashboard
          </Link>
          <button 
            onClick={scrollToPlans}
            className="btn-outline px-10 py-4 text-lg flex items-center justify-center"
          >
            View Membership Plans
          </button>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans-section" className="py-24 px-8 max-w-7xl mx-auto">
        <header className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">Membership Plans</h2>
          <p className="text-secondary-500">Choose the perfect membership to elevate your wellness journey.</p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="text-primary animate-spin mb-4" size={48} />
            <p className="text-secondary-500">Loading exclusive plans...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan._id} 
                className={`flex flex-col relative ${plan.status === 'Active' ? 'border-primary/30' : 'opacity-50'}`}
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
                    <div className="flex items-start gap-3 text-secondary-600 text-sm leading-relaxed">
                      <Check size={18} className="text-primary mt-0.5 shrink-0" />
                      <span>{plan.description}</span>
                    </div>
                  </div>
                </div>

                <Link href="/login">
                  <Button 
                    className="w-full py-4 shadow-lg"
                    disabled={plan.status !== 'Active'}
                  >
                    Join Now
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
