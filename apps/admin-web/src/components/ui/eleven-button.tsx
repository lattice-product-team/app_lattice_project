"use client";

import { Button as HeroButton, ButtonProps as HeroButtonProps } from "@heroui/react";
import { cn } from "@/lib/utils"; // Assuming there is a cn utility, if not I'll create it

interface ElevenButtonProps extends HeroButtonProps {
  variant?: "primary" | "ghost" | "tab" | "compact";
}

export function ElevenButton({ 
  variant = "primary", 
  className, 
  children, 
  ...props 
}: ElevenButtonProps) {
  
  const variantStyles = {
    primary: "bg-obsidian text-eggshell font-medium hover:opacity-90 shadow-subtle-2",
    ghost: "bg-white text-obsidian border-1 border-chalk hover:bg-powder shadow-subtle-2",
    tab: "bg-transparent text-obsidian border-1 border-chalk hover:bg-powder font-bold tracking-pill uppercase text-[14px]",
    compact: "bg-transparent text-obsidian border-1 border-chalk hover:bg-powder px-2 py-1 h-auto min-w-0"
  };

  return (
    <HeroButton
      radius="full"
      className={cn(
        "transition-all duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </HeroButton>
  );
}
