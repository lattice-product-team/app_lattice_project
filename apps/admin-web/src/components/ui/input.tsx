'use client';

import { Input as HeroInput, InputProps as HeroInputProps } from '@heroui/react';
import { cn } from '@/lib/utils';

interface InputProps extends Omit<HeroInputProps, 'variant'> {
  variant?: 'contained' | 'transparent';
  classNames?: {
    inputWrapper?: string;
    input?: string;
    label?: string;
  };
}

export function Input({
  variant = 'contained',
  className,
  classNames: userClassNames,
  ...props
}: InputProps) {
  const ariaLabel = props['aria-label'] || props.placeholder || 'Input field';

  /**
   * NOTE: In React 19, HeroUI v3.0.3 may leak the 'classNames' prop to the DOM input element.
   * To prevent this, we use data-slot attribute selectors within the 'className' prop
   * to style the internal slots (inputWrapper, input, label) using Tailwind v4 syntax.
   */
  return (
    <HeroInput
      className={cn(
        'transition-all duration-200',
        // Base slot styling
        '**:data-[slot=input-wrapper]:h-12 **:data-[slot=input-wrapper]:px-5 **:data-[slot=input-wrapper]:rounded-none',
        // Variant styling for inputWrapper
        variant === 'contained' &&
          '**:data-[slot=input-wrapper]:bg-white **:data-[slot=input-wrapper]:border **:data-[slot=input-wrapper]:border-chalk **:data-[slot=input-wrapper]:shadow-subtle-3',
        variant === 'transparent' &&
          '**:data-[slot=input-wrapper]:bg-transparent **:data-[slot=input-wrapper]:border-b **:data-[slot=input-wrapper]:border-obsidian **:data-[slot=input-wrapper]:shadow-none',
        // Input styling
        '**:data-[slot=input]:text-admin-base **:data-[slot=input]:text-obsidian **:data-[slot=input]:placeholder:text-slate',
        // Label styling
        '**:data-[slot=label]:text-gravel **:data-[slot=label]:font-medium **:data-[slot=label]:mb-1',
        // User provided slot classes (merged via data-slot selectors)
        userClassNames?.inputWrapper &&
          `**:data-[slot=input-wrapper]:${userClassNames.inputWrapper}`,
        userClassNames?.input && `**:data-[slot=input]:${userClassNames.input}`,
        userClassNames?.label && `**:data-[slot=label]:${userClassNames.label}`,
        className
      )}
      aria-label={ariaLabel}
      {...props}
    />
  );
}
