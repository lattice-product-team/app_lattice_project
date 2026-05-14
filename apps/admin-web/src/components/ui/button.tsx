'use client';

import { Button as HeroButton, ButtonProps as HeroButtonProps } from '@heroui/react';
import { cn } from '@/lib/utils'; // Assuming there is a cn utility, if not I'll create it

interface ButtonProps extends Omit<HeroButtonProps, 'variant'> {
  variant?: 'primary' | 'ghost' | 'tab' | 'compact';
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  const variantStyles = {
    primary: 'bg-foreground text-background font-medium hover:opacity-90 shadow-subtle-2',
    ghost: 'bg-transparent text-foreground border border-border hover:bg-elevated shadow-subtle',
    tab: 'bg-transparent text-foreground border border-border hover:bg-elevated font-bold tracking-pill uppercase text-admin-base',
    compact:
      'bg-transparent text-foreground border border-border hover:bg-elevated px-2 py-1 h-auto min-w-0 shadow-none',
  };

  return (
    <HeroButton
      className={cn('transition-all duration-200 rounded-full', variantStyles[variant], className)}
      {...props}
    >
      {children}
    </HeroButton>
  );
}
