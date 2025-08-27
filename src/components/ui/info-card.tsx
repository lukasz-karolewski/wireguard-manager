import { FC, ReactNode } from "react";

interface InfoCardProps {
  className?: string;
  items: InfoItem[];
}

interface InfoItem {
  label: string;
  value: ReactNode | string;
}

export const InfoCard: FC<InfoCardProps> = ({ className = "", items }) => {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <div className="flex items-center gap-3" key={index}>
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
