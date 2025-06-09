import { clsx } from "clsx";
import { FC } from "react";

interface StatusIndicatorProps {
  className?: string;
  type: "active" | "default" | "inactive";
}

export const StatusIndicator: FC<StatusIndicatorProps> = ({ className = "", type }) => {
  return (
    <div
      className={clsx("h-1 w-full", className, {
        "bg-gradient-to-r from-amber-400 to-orange-500": type === "default",
        "bg-gradient-to-r from-blue-400 to-cyan-500": type === "active",
        "bg-gray-300": type === "inactive",
      })}
    />
  );
};
