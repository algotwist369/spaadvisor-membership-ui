"use client";

import React from "react";
import { Calendar, IdCard, Phone, User, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(!user);

  const loadProfile = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchMe();
    } finally {
      setIsLoading(false);
    }
  }, [fetchMe]);

  React.useEffect(() => {
    if (!user) {
      let isActive = true;
      void fetchMe().finally(() => {
        if (isActive) setIsLoading(false);
      });
      return () => { isActive = false; };
    }
  }, [user, fetchMe]);

  if (!user && isLoading) {
    return <div className="py-20 text-center text-secondary-500">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl lg:text-3xl font-bold text-secondary-900">Profile</h1>
          <p className="mt-2 text-secondary-500 text-sm">Unable to load your profile details right now.</p>
        </header>
        <Card className="text-center p-8 lg:p-12">
          <p className="text-secondary-500">Try reloading your profile data.</p>
          <Button onClick={loadProfile} isLoading={isLoading} className="mt-6">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-secondary-900">Profile</h1>
          <p className="mt-1 lg:mt-2 text-secondary-500 text-sm lg:text-base">
            Review the member information currently available in your account.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadProfile}
          isLoading={isLoading}
          className="w-full sm:w-auto min-w-[120px]"
        >
          Refresh Data
        </Button>
      </header>

      <Card className="overflow-hidden p-0 border-none lg:border lg:border-secondary-100">
        <div className="border-b border-secondary-100 bg-primary/5 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shrink-0 shadow-lg shadow-primary/20">
              <User size={32} />
            </div>
            <div>
              <p className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-primary">
                Membership Profile
              </p>
              <h2 className="mt-1 text-2xl lg:text-3xl font-bold text-secondary-900">{user.name}</h2>
              <p className="mt-1 text-secondary-500 text-sm">Authenticated via OTP-based access</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 lg:p-8 sm:grid-cols-2">
          {[
            { icon: Phone, label: "Mobile Number", value: user.mobileNumber },
            { icon: IdCard, label: "Client ID", value: user._id, isSmall: true },
            { icon: Calendar, label: "Member Since", value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A" },
            { icon: ShieldCheck, label: "Session Status", value: "Securely Logged In" },
          ].map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-secondary-100 bg-secondary-50 p-5 lg:p-6 transition-colors hover:bg-secondary-100/50">
              <div className="mb-3 flex items-center gap-3 text-secondary-500">
                <item.icon size={18} className="text-primary" />
                <span className="text-xs lg:text-sm font-medium">{item.label}</span>
              </div>
              <p className={`font-bold text-secondary-900 ${item.isSmall ? 'text-xs break-all' : 'text-lg'}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
