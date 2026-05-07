'use client';

import { Button as HeroButton, ButtonProps as HeroButtonProps } from '@heroui/react';
import { cn } from '@/lib/utils'; // Assuming there is a cn utility, if not I'll create it

interface ButtonProps extends Omit<HeroButtonProps, 'variant'> {
  variant?: 'primary' | 'ghost' | 'tab' | 'compact';
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  const variantStyles = {
    primary: 'bg-obsidian text-eggshell font-medium hover:opacity-90 shadow-subtle-2',
    ghost: 'bg-white text-obsidian border border-chalk hover:bg-powder shadow-subtle-2',
    tab: 'bg-transparent text-obsidian border border-chalk hover:bg-powder font-bold tracking-pill uppercase text-admin-base',
    compact:
      'bg-transparent text-obsidian border border-chalk hover:bg-powder px-2 py-1 h-auto min-w-0',
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
