import { clsx } from "clsx";
import { FC } from "react";

import Link from "~/components/ui/link";
import { Client } from "~/generated/prisma/client";

interface ClientConfigProps {
  client: Client;
}

export const ClientItem: FC<React.PropsWithChildren<ClientConfigProps>> = ({ client }) => {
  return (
    <Link href={`/clients/${client.id}#${client.name}`} key={client.name}>
      <div
        className={clsx("  p-4", {
          "bg-gray-100/50": !client.enabled,
          "bg-gray-100 hover:bg-gray-300": client.enabled,
        })}
      >
        <div className="flex items-center justify-between">
          {client.name}
          {client.enabled ? "" : " - Disabled"}
        </div>
      </div>
    </Link>
  );
};
