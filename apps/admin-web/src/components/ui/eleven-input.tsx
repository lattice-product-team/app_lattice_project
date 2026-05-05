"use client";

import { Input as HeroInput, InputProps as HeroInputProps } from "@heroui/react";
import { cn } from "@/lib/utils";

interface ElevenInputProps extends HeroInputProps {
  variant?: "contained" | "transparent";
}

export function ElevenInput({ 
  variant = "contained", 
  className, 
  ...props 
}: ElevenInputProps) {
  
  const variantStyles = {
    contained: {
      inputWrapper: "bg-white border-1 border-chalk shadow-subtle-3",
      input: "text-obsidian placeholder:text-slate",
    },
    transparent: {
      inputWrapper: "bg-transparent border-b-1 border-obsidian shadow-none",
      input: "text-obsidian placeholder:text-slate",
    }
  };

  return (
    <HeroInput
      radius="none"
      classNames={{
        inputWrapper: cn(
          "transition-all duration-200 h-12 px-5",
          variantStyles[variant].inputWrapper
        ),
        input: cn(
          "text-[14px]",
          variantStyles[variant].input
        ),
        label: "text-gravel font-medium mb-1",
        ...props.classNames
      }}
      {...props}
    />
  );
}
