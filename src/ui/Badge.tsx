import type { HTMLAttributes, ReactNode } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'success';
}

export function Badge({ children, className = '', variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-900 text-slate-50',
    secondary: 'bg-slate-100 text-slate-700',
    destructive: 'bg-red-100 text-red-700',
    success: 'bg-emerald-100 text-emerald-700',
  } as const;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
