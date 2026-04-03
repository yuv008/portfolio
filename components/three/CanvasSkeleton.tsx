import type { ReactNode } from "react";

type CanvasSkeletonProps = {
  className?: string;
  children?: ReactNode;
};

export function CanvasSkeleton({ className = "", children }: CanvasSkeletonProps) {
  return (
    <div className={`skeleton-panel ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-neural-cyan/6 via-transparent to-neural-violet/10" />
      <div className="absolute inset-6 rounded-[1.5rem] border border-surface-border/15" />
      {children ? <div className="relative z-10 h-full">{children}</div> : null}
    </div>
  );
}
