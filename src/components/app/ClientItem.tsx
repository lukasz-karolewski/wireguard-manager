import { clsx } from "clsx";
import { FC } from "react";

import type { RouterOutputs } from "~/trpc/shared";

import Link from "~/components/ui/link";

interface ClientConfigProps {
  client: RouterOutputs["client"]["getAll"][0];
}

export const ClientItem: FC<React.PropsWithChildren<ClientConfigProps>> = ({ client }) => {
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
        </div>
      </div>
    </Link>
  );
};
