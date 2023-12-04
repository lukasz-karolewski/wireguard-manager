import { Client } from "@prisma/client";
import clsx from "clsx";
import { FC } from "react";
import Link from "~/components/ui/link";

type ClientConfigProps = {
  client: Client;
};

export const ClientItem: FC<React.PropsWithChildren<ClientConfigProps>> = ({ client }) => {
  return (
    <div
      className={clsx(" p-4", {
        "bg-gray-100": client.enabled,
        "bg-gray-100/50": !client.enabled,
      })}
    >
      <Link key={client.name} href={`/clients/${client.id}`}>
        {client.name}
        {client.enabled ? "" : " - Disabled"}
      </Link>
    </div>
  );
};
