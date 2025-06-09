"use client";

import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { FC } from "react";

import type { RouterOutputs } from "~/trpc/shared";

import { Button } from "~/components/ui/button";
import Link from "~/components/ui/link";
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
    <Link href={`/clients/${client.id}#${client.name}`} key={client.name}>
      <div
        className={clsx("p-4", {
          "bg-gray-100/50": !client.enabled,
          "bg-gray-100 hover:bg-gray-300": client.enabled,
        })}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-medium">
              {client.name}
              {client.enabled ? "" : " - Disabled"}
            </span>
            <span className="text-sm text-gray-600">
              Owner: {client.owner.name ?? client.owner.email ?? "Unknown"}
            </span>
          </div>
          {client.enabled && defaultSite && (
            <Button
              className="ml-2 shrink-0 py-6 px-8"
              onClick={handleDownload}
              size="sm"
              title={`Download configs for site "${defaultSite.name}"`}
              variant="ghost"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};
