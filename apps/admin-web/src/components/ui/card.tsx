"use client";

import { Card as HeroCard, CardProps as HeroCardProps } from "@heroui/react";
import { cn } from "@/lib/utils";

export function Card({ 
  className, 
  children, 
  ...props 
}: HeroCardProps) {
  
  return (
    <HeroCard
      className={cn(
        "hairline-card p-6 rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
    </HeroCard>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("mb-6", className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  );
}
