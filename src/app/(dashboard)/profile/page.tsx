"use client";

import React from "react";
import { Calendar, IdCard, Phone, RefreshCw, ShieldCheck, User } from "lucide-react";
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
        if (isActive) {
          setIsLoading(false);
        }
      });

      return () => {
        isActive = false;
      };
    }
  }, [user, fetchMe]);

  if (!user && isLoading) {
    return <div className="py-16 text-center text-secondary-500">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-secondary-900">Profile</h1>
          <p className="mt-2 text-secondary-500">
            Unable to load your profile details right now.
          </p>
        </header>
        <Card className="text-center">
          <p className="text-secondary-500">Try reloading your profile data.</p>
          <Button onClick={loadProfile} isLoading={isLoading} className="mt-6">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Profile</h1>
          <p className="mt-2 text-secondary-500">
            Review the member information currently available in your account.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadProfile}
          isLoading={isLoading}
          className="min-w-36"
        >
          Refresh
        </Button>
      </header>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-secondary-100 bg-primary/5 px-6 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white">
              <User size={28} />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                Member Profile
              </p>
              <h2 className="mt-1 text-2xl font-bold text-secondary-900">{user.name}</h2>
              <p className="mt-1 text-secondary-500">Authenticated via OTP-based access</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <div className="rounded-2xl border border-secondary-100 bg-secondary-50 p-5">
            <div className="mb-3 flex items-center gap-3 text-secondary-900">
              <Phone size={18} className="text-primary" />
              <span className="font-medium">Mobile Number</span>
            </div>
            <p className="text-lg font-bold text-secondary-900">{user.mobileNumber}</p>
          </div>

          <div className="rounded-2xl border border-secondary-100 bg-secondary-50 p-5">
            <div className="mb-3 flex items-center gap-3 text-secondary-900">
              <IdCard size={18} className="text-primary" />
              <span className="font-medium">Client ID</span>
            </div>
            <p className="break-all text-sm font-medium text-secondary-700">{user._id}</p>
          </div>

          <div className="rounded-2xl border border-secondary-100 bg-secondary-50 p-5">
            <div className="mb-3 flex items-center gap-3 text-secondary-900">
              <Calendar size={18} className="text-primary" />
              <span className="font-medium">Member Since</span>
            </div>
            <p className="text-lg font-bold text-secondary-900">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not available"}
            </p>
          </div>

          <div className="rounded-2xl border border-secondary-100 bg-secondary-50 p-5">
            <div className="mb-3 flex items-center gap-3 text-secondary-900">
              <ShieldCheck size={18} className="text-primary" />
              <span className="font-medium">Session Status</span>
            </div>
            <p className="text-lg font-bold text-secondary-900">Secure</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
