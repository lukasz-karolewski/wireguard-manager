import { clsx } from "clsx";
import { FC } from "react";

interface StatusDotProps {
  className?: string;
  color: "amber" | "blue" | "gray" | "green" | "purple" | "red";
  size?: "lg" | "md" | "sm";
}

export const StatusDot: FC<StatusDotProps> = ({ className = "", color, size = "md" }) => {
  return (
    <div
      className={clsx("rounded-full flex-shrink-0", className, {
        // Color variants
        "bg-amber-400": color === "amber",
        "bg-blue-400": color === "blue",
        "bg-gray-400": color === "gray",
        "bg-green-400": color === "green",
        "bg-purple-400": color === "purple",
        "bg-red-400": color === "red",
        // Size variants
        "w-2 h-2": size === "sm",
        "w-3 h-3": size === "md",
        "w-4 h-4": size === "lg",
      })}
    />
  );
};
