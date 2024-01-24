import { Client } from "@prisma/client";
import clsx from "clsx";
import { FC } from "react";
import Link from "~/components/ui/link";

type ClientConfigProps = {
  client: Client;
};

export const ClientItem: FC<React.PropsWithChildren<ClientConfigProps>> = ({ client }) => {
  return (
    <Link key={client.name} href={`/clients/${client.id}#${client.name}`}>
      <div
        className={clsx("  p-4", {
          "bg-gray-100 hover:bg-gray-300": client.enabled,
          "bg-gray-100/50": !client.enabled,
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
