import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  height?: number | string;
  rounded?: string;
  itens?: number;
}

export function Skeleton({ className = '', height, rounded, ...props }: SkeletonProps) {
  const classes = [
    'animate-pulse bg-slate-200',
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
  return <Skeleton {...props} className={`h-10 w-full ${props.className ?? ''}`.trim()} />;
}
