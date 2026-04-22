"use client";

import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  // Allow access to 'plans' without authentication
  const isPublicRoute = pathname === '/plans';

  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated && !isPublicRoute) {
      router.replace('/login');
    }
  }, [isAuthenticated, isPublicRoute, router, isMounted]);

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-dark">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};
