import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-xs font-semibold text-slate-300">{label}</label>}
      <input
        className={`w-full bg-slate-950 border ${
          error ? 'border-rose-500 text-rose-200' : 'border-slate-800 text-white focus:border-emerald-500'
        } rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-slate-500">{helperText}</p>}
    </div>
  );
};
