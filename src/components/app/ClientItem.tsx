"use client";

import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { FC } from "react";

import type { RouterOutputs } from "~/trpc/shared";

import { Badge } from "~/components/ui/badge";
import Link from "~/components/ui/link";
import { StatusDot } from "~/components/ui/status-dot";
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
    <div className="group relative">
      <Link
        className="block cursor-pointer"
        href={`/clients/${client.id}#${client.name}`}
        key={client.name}
      >
        <div
          className={clsx(
            "relative overflow-hidden rounded-xl border transition-all duration-200 ease-out",
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
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">{client.name}</h3>
                  {!client.enabled && <Badge variant="disabled">Disabled</Badge>}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {client.owner.name ?? client.owner.email ?? "Unknown owner"}
                </p>
              </div>

              {client.enabled && defaultSite && (
                <button
                  className="ml-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={handleDownload}
                  title={`Download configs for site "${defaultSite.name}"`}
                  type="button"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            {client.enabled && (
              <div className="mt-4 flex items-center text-xs text-gray-500">
                <StatusDot color="green" />
                <span className="ml-2">Active</span>
              </div>
            )}
          </div>

          {/* Hover overlay */}
          {client.enabled && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          )}
        </div>
      </Link>
    </div>
  );
};
