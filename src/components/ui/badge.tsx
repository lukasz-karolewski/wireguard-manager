import { clsx } from "clsx";
import type { FC, ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  size?: "md" | "sm";
  variant?: "default" | "disabled" | "error" | "success" | "warning";
}

export const Badge: FC<BadgeProps> = ({ children, className = "", size = "sm", variant = "default" }) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-medium",
        {
          // Variant styles
          "bg-amber-100 text-amber-800": variant === "default",
          "bg-gray-100 text-gray-600": variant === "disabled",
          "bg-green-100 text-green-800": variant === "success",
          "bg-red-100 text-red-800": variant === "error",
          "bg-yellow-100 text-yellow-800": variant === "warning",
          // Size variants
          "px-2 py-1 text-xs": size === "sm",
          "px-3 py-1 text-sm": size === "md",
        },
        className,
      )}
    >
      {children}
    </span>
  );
};
