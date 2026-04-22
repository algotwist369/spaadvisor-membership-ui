import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable }) => {
  return (
    <div
      className={cn(
        'glass-card transition-all duration-300',
        hoverable && 'hover:translate-y-[-4px] hover:shadow-primary/10 hover:border-primary/30',
        className
      )}
    >
      {children}
    </div>
  );
};
