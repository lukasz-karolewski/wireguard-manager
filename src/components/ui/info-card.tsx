import { FC, ReactNode } from "react";

interface InfoCardProps {
  className?: string;
  items: InfoItem[];
  title: string;
}

interface InfoItem {
  color: "amber" | "blue" | "gray" | "green" | "purple" | "red";
  label: string;
  value: ReactNode | string;
}

const colorClasses = {
  amber: "bg-amber-400",
  blue: "bg-blue-400",
  gray: "bg-gray-400",
  green: "bg-green-400",
  purple: "bg-purple-400",
  red: "bg-red-400",
};

export const InfoCard: FC<InfoCardProps> = ({ className = "", items, title }) => {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <div className="flex items-center gap-3" key={index}>
            <div className={`w-2 h-2 ${colorClasses[item.color]} rounded-full flex-shrink-0`} />
            <div>
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-sm text-gray-600">
                {typeof item.value === "string" ? item.value : item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
