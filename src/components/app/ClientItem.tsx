"use client";

import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { FC } from "react";

import type { RouterOutputs } from "~/trpc/shared";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import Link from "~/components/ui/link";
import { StatusIndicator } from "~/components/ui/status-indicator";
import { api } from "~/trpc/react";
import { downloadAllConfigsForSite } from "~/utils";

interface ClientConfigProps {
  client: RouterOutputs["client"]["getAll"][0];
}

export const ClientItem: FC<React.PropsWithChildren<ClientConfigProps>> = ({ client }) => {
  const { data: sites } = api.site.getAll.useQuery();

  const defaultSite = sites?.find((site) => site.isDefault);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();

    if (defaultSite && client.enabled) {
      await downloadAllConfigsForSite(client.id, defaultSite.id);
    }
  };

  return (
    <div className="group relative w-full min-w-0">
      <Link
        className="block w-full cursor-pointer"
        href={`/clients/${client.id}#${client.name}`}
        key={client.name}
      >
        <div
          className={clsx(
            "relative w-full overflow-hidden rounded-xl border transition-all duration-200 ease-out",
            {
              "border-gray-100 bg-gray-50/50 opacity-75": !client.enabled,
              "border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300":
                client.enabled,
            },
          )}
        >
          {/* Status indicator */}
          <StatusIndicator type={client.enabled ? "active" : "inactive"} />

          <div className="p-6">
            <div className="flex items-start">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="truncate font-semibold text-gray-900">{client.name}</h3>
                  {!client.enabled && <Badge variant="disabled">Disabled</Badge>}
                </div>
                <p className="truncate text-sm text-gray-600">
                  {client.owner.name ?? client.owner.email ?? "Unknown owner"}
                </p>
              </div>

              {client.enabled && defaultSite && (
                <Button
                  onClick={handleDownload}
                  size="icon"
                  title={`Download configs for site "${defaultSite.name}"`}
                  variant="ghost"
                >
                  <DocumentArrowDownIcon className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
