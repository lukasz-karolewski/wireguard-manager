import type { FC } from "react";
import type { ClientConfigType } from "~/server/utils/types";
import WgConfig from "./WgConfig";

interface ConfigGridProps {
  clientName: string;
  configs: { type: ClientConfigType; value: string }[];
  show: "config" | "qr";
}

export const ConfigGrid: FC<ConfigGridProps> = ({ clientName, configs, show }) => {
  return (
    <div className="border-t border-gray-100 bg-gray-50/50">
      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {configs.map((config) => (
            <WgConfig clientName={clientName} config={config} key={clientName} show={show} />
          ))}
        </div>
      </div>
    </div>
  );
};
