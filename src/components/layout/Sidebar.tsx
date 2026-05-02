"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  CreditCard, 
  Wallet, 
  User, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export const Sidebar: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Sparkles, label: 'Membership Plans', path: '/plans' },
    { icon: Wallet, label: 'My Wallet', path: '/wallet' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="w-64 bg-white border-r border-secondary-200 h-screen fixed left-0 top-0 flex flex-col p-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <img 
          src="https://res.cloudinary.com/dxpxcptn4/image/upload/v1771596901/lead_funnel/Logo/ueieevrqtlohixofo1fe.png" 
          alt="SpaAdvisor Logo" 
          className="h-10 w-auto"
        />
        <span className="text-xl font-bold text-primary">SpaAdvisor</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive 
                  ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20' 
                  : 'text-secondary-500 hover:bg-primary/5 hover:text-primary'}
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-secondary-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 mt-auto"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};
