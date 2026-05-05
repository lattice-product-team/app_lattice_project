"use client";

import { Input as HeroInput, InputProps as HeroInputProps } from "@heroui/react";
import { cn } from "@/lib/utils";

interface InputProps extends Omit<HeroInputProps, "variant"> {
  variant?: "contained" | "transparent";
}

export function Input({ 
  variant = "contained", 
  className, 
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

  const { classNames: userClassNames, ...otherProps } = props;

  return (
    <HeroInput
      classNames={{
        inputWrapper: cn(
          "transition-all duration-200 h-12 px-5 rounded-none",
          variantStyles[variant].inputWrapper,
          userClassNames?.inputWrapper
        ),
        input: cn(
          "text-admin-base",
          variantStyles[variant].input,
          userClassNames?.input
        ),
        label: cn("text-gravel font-medium mb-1", userClassNames?.label),
      }}
      {...otherProps}
    />
  );
}
