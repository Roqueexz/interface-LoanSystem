import { useState, useRef } from "react";
import type { TouchEvent, ReactNode } from "react";

interface SwipeableRowProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftActionLabel?: string;
  rightActionLabel?: string;
  className?: string;
}

export function SwipeableRow({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftActionLabel = "Ação",
  rightActionLabel = "Excluir",
  className = "",
}: SwipeableRowProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startXRef = useRef<number>(0);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    startXRef.current = e.touches[0].clientX;
    setSwiping(true);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!swiping) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startXRef.current;
    // Limit drag range
    if (Math.abs(deltaX) < 120) {
      setOffsetX(deltaX);
    }
  };

  const handleTouchEnd = () => {
    setSwiping(false);
    if (offsetX > 75 && onSwipeRight) {
      onSwipeRight();
    } else if (offsetX < -75 && onSwipeLeft) {
      onSwipeLeft();
    }
    setOffsetX(0);
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Background action hints */}
      <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-red-500 rounded-2xl">
        <span className="opacity-90">{leftActionLabel}</span>
        <span className="opacity-90">{rightActionLabel}</span>
      </div>

      {/* Foreground touch container */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: swiping ? "none" : "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="relative bg-card rounded-2xl touch-feedback"
      >
        {children}
      </div>
    </div>
  );
}

export default SwipeableRow;
