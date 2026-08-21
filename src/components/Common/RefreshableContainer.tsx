import React, { useState, useRef, useCallback } from 'react';
import { Loader2, ArrowDown } from 'lucide-react';

interface RefreshableContainerProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

const PULL_THRESHOLD = 60;
const MAX_PULL_DISTANCE = 90;

export function RefreshableContainer({
  children,
  onRefresh,
  className = '',
}: RefreshableContainerProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const isPulling = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Apenas inicia o gesto se a página estiver no topo absoluto
    if (window.scrollY === 0 && !isRefreshing) {
      touchStartY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling.current || isRefreshing || window.scrollY > 0) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;

    if (diff > 0) {
      // Aplica resistência ao puxar
      const distance = Math.min(diff * 0.45, MAX_PULL_DISTANCE);
      setPullDistance(distance);
    } else {
      setPullDistance(0);
    }
  };

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current) return;
    isPulling.current = false;

    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(50); // Mantém o spinner visível enquanto atualiza

      try {
        await onRefresh();
      } catch (error) {
        console.error('[RefreshableContainer] Erro durante o refresh:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, isRefreshing, onRefresh]);

  return (
    <div
      className={`relative w-full ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Indicador Mobile de Pull-to-Refresh */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-center transition-transform duration-200 z-30"
        style={{
          transform: `translateY(${pullDistance > 0 || isRefreshing ? pullDistance - 40 : -50}px)`,
          opacity: pullDistance > 10 || isRefreshing ? 1 : 0,
        }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border shadow-lg text-primary">
          {isRefreshing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ArrowDown
              className="h-5 w-5 transition-transform duration-200"
              style={{
                transform: `rotate(${pullDistance >= PULL_THRESHOLD ? 180 : 0}deg)`,
              }}
            />
          )}
        </div>
      </div>

      {/* Conteúdo com deslocamento suave durante o puxão */}
      <div
        style={{
          transform: `translateY(${pullDistance > 0 ? pullDistance * 0.35 : 0}px)`,
          transition: isPulling.current ? 'none' : 'transform 0.25s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default RefreshableContainer;
