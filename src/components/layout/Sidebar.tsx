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
  Sparkles,
  X
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
    if (onClose) onClose();
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Sparkles, label: 'Membership Plans', path: '/plans' },
    { icon: Wallet, label: 'My Wallet', path: '/wallet' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="w-64 bg-white border-r border-secondary-200 h-full flex flex-col p-6 shadow-xl lg:shadow-none">
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center gap-3">
          <img 
            src="https://res.cloudinary.com/dxpxcptn4/image/upload/v1771596901/lead_funnel/Logo/ueieevrqtlohixofo1fe.png" 
            alt="SpaAdvisor Logo" 
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold text-primary">SpaAdvisor</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors text-secondary-500"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => onClose && onClose()}
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
