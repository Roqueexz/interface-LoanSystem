import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  height?: number | string;
  rounded?: string;
  itens?: number;
}

export function Skeleton({ className = '', height, rounded, ...props }: SkeletonProps) {
  const classes = [
    'animate-pulse bg-slate-200 dark:bg-slate-800/60',
    rounded ? `rounded-${rounded}` : 'rounded',
    height ? `h-[${typeof height === 'number' ? `${height}px` : height}]` : '',
    className,
  ].filter(Boolean);

  return <div className={classes.join(' ')} {...props} />;
}

export function SkeletonBase(props: SkeletonProps) {
  return <Skeleton {...props} className={`h-4 w-full ${props.className ?? ''}`.trim()} />;
}

export function SkeletonCaixaCards(props: SkeletonProps) {
  return <Skeleton {...props} className={`h-24 w-full ${props.className ?? ''}`.trim()} />;
}

export function SkeletonDetalhes(props: SkeletonProps) {
  return <Skeleton {...props} className={`h-6 w-full ${props.className ?? ''}`.trim()} />;
}

export function SkeletonLista(props: SkeletonProps) {
  const count = props.itens || 4;
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} {...props} className={`h-12 w-full rounded-xl ${props.className ?? ''}`.trim()} />
      ))}
    </div>
  );
}

export function SkeletonCardGrid({ count = 6, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl border border-border bg-card space-y-4 animate-pulse">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-1/2 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-16 w-full rounded-xl" />
          <div className="flex gap-2 pt-2 border-t border-border/50">
            <Skeleton className="h-8 flex-1 rounded-xl" />
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

