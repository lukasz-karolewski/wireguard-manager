import { clsx } from "clsx";
import { FC, ReactNode } from "react";

import Accordion from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { StatusDot } from "~/components/ui/status-dot";
import { StatusIndicator } from "~/components/ui/status-indicator";

interface SiteCardProps {
  actions?: ReactNode;
  children?: ReactNode;
  isActive: boolean;
  isInitiallyOpen?: boolean;
  site: {
    endpointAddress: string;
    id: number;
    isDefault: boolean;
    name: string;
  };
}

export const SiteCard: FC<SiteCardProps> = ({
  actions,
  children,
  isActive,
  isInitiallyOpen = false,
  site,
}) => {
  return (
    <div
      className={clsx("rounded-xl border transition-all duration-200 ease-out overflow-hidden", {
        "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm":
          isActive && site.isDefault,
        "border-gray-200 bg-gray-50/50 shadow-sm opacity-75": !isActive,
        "border-gray-200 bg-white shadow-sm": isActive && !site.isDefault,
      })}
    >
      <StatusIndicator type={isActive ? (site.isDefault ? "default" : "active") : "inactive"} />

      <Accordion
        actions={actions}
        className="border-0 bg-transparent"
        header={
          <div className="flex items-center gap-3">
            <StatusDot color={isActive ? (site.isDefault ? "amber" : "blue") : "gray"} />
            <div>
              <h3
                className={clsx("font-semibold", {
                  "text-gray-700": !isActive,
                  "text-gray-900": isActive,
                })}
              >
                {site.name}
              </h3>
              <p
                className={clsx("text-sm", {
                  "text-gray-500": !isActive,
                  "text-gray-600": isActive,
                })}
              >
                {isActive ? site.endpointAddress : "Inactive"}
              </p>
            </div>
            {site.isDefault && isActive && <Badge variant="default">Default</Badge>}
          </div>
        }
        isInitiallyOpen={isInitiallyOpen}
      >
        {children}
      </Accordion>
    </div>
  );
};
