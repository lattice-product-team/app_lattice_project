"use client";

import { Input as HeroInput, InputProps as HeroInputProps } from "@heroui/react";
import { cn } from "@/lib/utils";

interface InputProps extends Omit<HeroInputProps, "variant"> {
  variant?: "contained" | "transparent";
  classNames?: {
    inputWrapper?: string;
    input?: string;
    label?: string;
  };
}

export function Input({ 
  variant = "contained", 
  className, 
  classNames: userClassNames,
  ...props 
}: InputProps) {
  
  const variantStyles = {
    contained: {
      inputWrapper: "bg-white border border-chalk shadow-subtle-3",
      input: "text-obsidian placeholder:text-slate",
    },
    transparent: {
      inputWrapper: "bg-transparent border-b border-obsidian shadow-none",
      input: "text-obsidian placeholder:text-slate",
    }
  };

  const ariaLabel = props["aria-label"] || props.placeholder || "Input field";

  /**
   * NOTE: In React 19, HeroUI v3.0.3 may leak the 'classNames' prop to the DOM input element.
   * To prevent this, we use data-slot attribute selectors within the 'className' prop
   * to style the internal slots (inputWrapper, input, label).
   */
  return (
    <HeroInput
      className={cn(
        "transition-all duration-200",
        // Base slot styling
        "[&_[data-slot=input-wrapper]]:h-12 [&_[data-slot=input-wrapper]]:px-5 [&_[data-slot=input-wrapper]]:rounded-none",
        // Variant styling for inputWrapper
        variant === "contained" && "[&_[data-slot=input-wrapper]]:bg-white [&_[data-slot=input-wrapper]]:border [&_[data-slot=input-wrapper]]:border-chalk [&_[data-slot=input-wrapper]]:shadow-subtle-3",
        variant === "transparent" && "[&_[data-slot=input-wrapper]]:bg-transparent [&_[data-slot=input-wrapper]]:border-b [&_[data-slot=input-wrapper]]:border-obsidian [&_[data-slot=input-wrapper]]:shadow-none",
        // Input styling
        "[&_[data-slot=input]]:text-admin-base [&_[data-slot=input]]:text-obsidian [&_[data-slot=input]]:placeholder:text-slate",
        // Label styling
        "[&_[data-slot=label]]:text-gravel [&_[data-slot=label]]:font-medium [&_[data-slot=label]]:mb-1",
        // User provided slot classes (merged via data-slot selectors)
        userClassNames?.inputWrapper && `[&_[data-slot=input-wrapper]]:${userClassNames.inputWrapper}`,
        userClassNames?.input && `[&_[data-slot=input]]:${userClassNames.input}`,
        userClassNames?.label && `[&_[data-slot=label]]:${userClassNames.label}`,
        className
      )}
      aria-label={ariaLabel}
      {...props}
    />
  );
}
