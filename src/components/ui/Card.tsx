import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glow' | 'border';
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, variant = 'default', className = '', ...props }) => {
  const baseStyle = 'bg-slate-900/90 backdrop-blur-md rounded-xl p-5 border shadow-xl transition-all';
  const variantStyle = {
    default: 'border-slate-800/80',
    glow: 'border-emerald-500/30 shadow-emerald-500/5 hover:border-emerald-500/50',
    border: 'border-slate-700/60',
  };

  return (
    <div className={`${baseStyle} ${variantStyle[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
