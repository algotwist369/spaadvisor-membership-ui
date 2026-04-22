"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles, Phone, User, Key, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Register() {
  const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { requestOtp, verifyOtp } = useAuthStore();
  const router = useRouter();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await requestOtp(name, mobileNumber);
      setStep('OTP');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await verifyOtp(name, mobileNumber, otp);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-white to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img 
            src="https://res.cloudinary.com/dxpxcptn4/image/upload/v1771596901/lead_funnel/Logo/ueieevrqtlohixofo1fe.png" 
            alt="SpaAdvisor Logo" 
            className="h-16 w-auto mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            {step === 'DETAILS' ? 'Join SpaAdvisor' : 'Verify Identity'}
          </h1>
          <p className="text-secondary-500">
            {step === 'DETAILS' 
              ? 'Start your wellness journey today' 
              : `Enter the code sent to ${mobileNumber}`}
          </p>
        </div>

        <Card className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {step === 'DETAILS' ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-12"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700 ml-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="input-field pl-12"
                    placeholder="10 digit mobile number"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full py-4 text-lg"
                isLoading={isLoading}
              >
                Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700 ml-1">Verification Code</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                  <input
                    type="text"
                    required
                    maxLength={4}
                    pattern="[0-9]{4}"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="input-field pl-12 tracking-[1em] font-bold"
                    placeholder="••••"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full py-4 text-lg"
                  isLoading={isLoading}
                >
                  Verify & Join
                </Button>
                <button
                  type="button"
                  onClick={() => setStep('DETAILS')}
                  className="flex items-center justify-center gap-2 text-secondary-500 hover:text-primary transition-colors py-2 text-sm"
                >
                  <ArrowLeft size={16} />
                  Back to details
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-secondary-100 text-center">
            <p className="text-secondary-500 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
