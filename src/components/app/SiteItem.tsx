import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { FC, useState } from "react";

import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "../ui/link";
import { StatusDot } from "../ui/status-dot";
import { StatusIndicator } from "../ui/status-indicator";

interface SiteConfigProps {
  site: NonNullable<RouterOutputs["site"]["getAll"][number]> & {
    needsUpdate?: boolean;
    remoteConfigCheckedAt?: Date | null;
    remoteConfigHash?: null | string;
  };
}

export const SiteItem: FC<SiteConfigProps> = ({ site }) => {
  const [localNeedsUpdate, setLocalNeedsUpdate] = useState(site.needsUpdate);
  const [localCheckedAt, setLocalCheckedAt] = useState<Date | null | string>(
    site.remoteConfigCheckedAt ?? null,
  );

  const refresh = api.site.refreshRemoteConfig.useMutation({
    onSuccess: (data) => {
      setLocalNeedsUpdate(data.needsUpdate);
      setLocalCheckedAt(data.remoteConfigCheckedAt ?? null);
    },
  });

  const canCheck = Boolean(site.hostname);
  const lastChecked = localCheckedAt ? new Date(localCheckedAt).toLocaleString() : null;
  const needsUpdate = localNeedsUpdate;
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
              "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm hover:shadow-md hover:border-amber-300":
                site.isDefault,
              "border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300":
                !site.isDefault,
            },
          )}
        >
          {/* Status indicator */}
          <StatusIndicator type={site.isDefault ? "default" : "active"} />

          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-gray-900 truncate">{site.name}</h3>
                  {site.isDefault && <Badge variant="default">Default</Badge>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <StatusDot color="blue" />
                    <span className="ml-2 truncate">{site.endpointAddress}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <StatusDot color="green" />
                    <span className="ml-2 truncate">Network: {site.assignedNetwork}</span>
                  </div>

                  {site.hostname && (
                    <div className="flex items-center text-sm text-gray-600">
                      <StatusDot color="purple" />
                      <span className="ml-2 truncate">Host: {site.hostname}</span>
                    </div>
                  )}

                  {canCheck && (
                    <div className="text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <StatusDot
                            color={
                              needsUpdate === undefined ? "gray" : needsUpdate ? "red" : "green"
                            }
                          />
                          <span className="truncate">
                            {needsUpdate === undefined
                              ? "Remote status unknown"
                              : needsUpdate
                                ? "Remote config differs"
                                : "Remote config up to date"}
                          </span>
                        </div>
                        <Button
                          aria-label="Refresh remote status"
                          disabled={refresh.isPending}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            refresh.mutate({ force: true, id: site.id });
                          }}
                          size="icon"
                          variant="outline"
                        >
                          <ArrowPathIcon
                            className={clsx("h-4 w-4", { "animate-spin": refresh.isPending })}
                          />
                        </Button>
                      </div>
                      {lastChecked && (
                        <div className="mt-1 text-xs text-gray-400">Checked: {lastChecked}</div>
                      )}
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
              },
            )}
          />
        </div>
      </Link>
    </div>
  );
};
