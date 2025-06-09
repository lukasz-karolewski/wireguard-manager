import { clsx } from "clsx";
import { FC } from "react";

import { RouterOutputs } from "~/trpc/shared";

import Link from "../ui/link";

interface SiteConfigProps {
  site: NonNullable<RouterOutputs["site"]["getAll"][number]>;
}

export const SiteItem: FC<SiteConfigProps> = ({ site }) => {
  return (
    <div className="group relative">
      <Link 
        className="block cursor-pointer"
        href={`/sites/${site.id}#${site.name}`}
        key={site.name}
      >
        <div
          className={clsx(
            "relative overflow-hidden rounded-xl border transition-all duration-200 ease-out",
            {
              "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm hover:shadow-md hover:border-amber-300": site.isDefault,
              "border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300": !site.isDefault,
            }
          )}
        >
          {/* Status indicator */}
          <div
            className={clsx("absolute top-0 left-0 w-full h-1", {
              "bg-gradient-to-r from-amber-400 to-orange-500": site.isDefault,
              "bg-gradient-to-r from-blue-400 to-cyan-500": !site.isDefault,
            })}
          />
          
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {site.name}
                  </h3>
                  {site.isDefault && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Default
                    </span>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 flex-shrink-0" />
                    <span className="truncate">{site.endpointAddress}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 flex-shrink-0" />
                    <span className="truncate">Network: {site.assignedNetwork}</span>
                  </div>
                  
                  {site.hostname && (
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 flex-shrink-0" />
                      <span className="truncate">Host: {site.hostname}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Hover overlay */}
          <div 
            className={clsx(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none",
              {
                "bg-gradient-to-r from-amber-50/0 to-amber-50/50": site.isDefault,
                "bg-gradient-to-r from-blue-50/0 to-blue-50/50": !site.isDefault,
              }
            )}
          />
        </div>
      </Link>
    </div>
  );
};
