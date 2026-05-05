"use client";

import { Card as HeroCard, CardProps as HeroCardProps } from "@heroui/react";
import { cn } from "@/lib/utils";

export function ElevenCard({ 
  className, 
  children, 
  ...props 
}: HeroCardProps) {
  
  return (
    <HeroCard
      radius="lg" // lg is 16px in HeroUI by default, or we can use custom
      className={cn(
        "hairline-card p-6",
        className
      )}
      {...props}
    >
      {children}
    </HeroCard>
  );
}

export function ElevenCardHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("mb-6", className)}>
      {children}
    </div>
  );
}

export function ElevenCardBody({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  );
}
