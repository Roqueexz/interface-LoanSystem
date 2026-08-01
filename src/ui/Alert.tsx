import type { HTMLAttributes, ReactNode } from 'react';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'destructive';
}

export function Alert({ children, className = '', variant = 'default', ...props }: AlertProps) {
  const base = variant === 'destructive'
    ? 'border-red-200 bg-red-50 text-red-900'
    : 'border-slate-200 bg-slate-50 text-slate-900';

  return (
    <div className={`rounded-lg border p-4 ${base} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function AlertTitle({ children, className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`font-semibold ${className}`.trim()} {...props}>{children}</h3>;
}

export function AlertDescription({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`mt-1 text-sm ${className}`.trim()} {...props}>{children}</div>;
}
