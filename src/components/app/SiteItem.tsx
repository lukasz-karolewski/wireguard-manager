import { ArrowPathIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { type FC, useEffect, useState } from "react";

import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";

import { Button } from "../ui/button";
import Link from "../ui/link";
import { StatusDot } from "../ui/status-dot";
import { StatusIndicator } from "../ui/status-indicator";

interface SiteConfigProps {
  site: NonNullable<RouterOutputs["site"]["getAll"][number]> & {
    needsUpdate?: boolean;
    remoteConfigCheckedAt?: Date | null;
    remoteConfigHash?: null | string;
    remoteRefreshError?: string;
  };
}
export const SiteItem: FC<SiteConfigProps> = ({ site }) => {
  const [localNeedsUpdate, setLocalNeedsUpdate] = useState(site.needsUpdate);
  const [localCheckedAt, setLocalCheckedAt] = useState<Date | null | string>(site.remoteConfigCheckedAt ?? null);
  const [localRefreshError, setLocalRefreshError] = useState<string | undefined>(site.remoteRefreshError);

  const refresh = api.site.refreshRemoteConfig.useMutation({
    onError: (err) => {
      setLocalRefreshError(err.message);
    },
    onSuccess: (data) => {
      setLocalNeedsUpdate(data.needsUpdate);
      setLocalCheckedAt(data.remoteConfigCheckedAt ?? new Date());
      setLocalRefreshError(data.errorMessage);
    },
  });

  // Auto-trigger a status check after mount without blocking UI
  useEffect(() => {
    // Let backend decide caching; do not force
    refresh.mutate({ id: site.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site.id, refresh]);
  const needsUpdate = localNeedsUpdate;
  return (
    <div className="group relative">
      <Link className="block cursor-pointer" href={`/sites/${site.id}#${site.name}`} key={site.name}>
        <div className="relative overflow-hidden rounded-xl border transition-all duration-200 ease-out border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300">
          <StatusIndicator type={site.isDefault ? "default" : "active"} />

          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-gray-900 truncate">{site.name}</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col text-sm">
                    <span className="ml-2 truncate">Endpoint: {site.endpointAddress}</span>

                    <span className="ml-2 truncate">Network: {site.assignedNetwork}</span>

                    {site.hostname && <span className="ml-2 truncate">Host: {site.hostname}</span>}
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <StatusDot
                          color={
                            refresh.isPending
                              ? "gray"
                              : localRefreshError
                                ? "red"
                                : needsUpdate === undefined
                                  ? "gray"
                                  : needsUpdate
                                    ? "red"
                                    : "green"
                          }
                        />
                        <span className="truncate">
                          {refresh.isPending
                            ? "Checking…"
                            : localRefreshError
                              ? "Error"
                              : needsUpdate === undefined
                                ? "Unknown"
                                : needsUpdate
                                  ? "Out of sync"
                                  : "Up to date"}
                        </span>
                        {(localRefreshError ?? site.remoteRefreshError) && (
                          <ExclamationTriangleIcon
                            className="h-4 w-4 text-red-500 flex-shrink-0"
                            title={localRefreshError ?? site.remoteRefreshError}
                          />
                        )}
                        <span className="mr-2 text-xs text-gray-400">
                          {localCheckedAt ? new Date(localCheckedAt).toLocaleTimeString() : "—"}
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
                        <ArrowPathIcon className={clsx("h-4 w-4", { "animate-spin": refresh.isPending })} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
