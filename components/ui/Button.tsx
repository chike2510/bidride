"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
type ButtonSize = "md" | "lg" | "icon";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-gold text-navy hover:bg-gold-hover shadow-soft",
  secondary: "bg-white text-navy border border-cardBorder hover:bg-bg",
  outline: "bg-transparent text-navy border border-cardBorder hover:bg-bg",
  ghost: "bg-transparent text-navy hover:bg-bg",
  danger: "bg-transparent text-urgency border border-urgency/30 hover:bg-urgency/5",
  success: "bg-success text-white hover:bg-success/90 shadow-soft",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-[15px]",
  lg: "h-[52px] px-6 text-base",
  icon: "h-11 w-11",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-btn font-semibold",
          "transition-colors duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          "min-h-[44px] min-w-[44px]",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
