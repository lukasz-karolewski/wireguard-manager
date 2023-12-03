import { Client } from "@prisma/client";
import { FC } from "react";
import Link from "~/components/ui/link";

type ClientConfigProps = {
  client: Client;
};

export const ClientItem: FC<React.PropsWithChildren<ClientConfigProps>> = ({ client }) => {
  return (
    <div className="bg-gray-100 p-4">
      <Link key={client.name} href={`/clients/${client.id}`}>
        {client.name}
        {client.enabled ? " (Enabled)" : " (Disabled)"}
      </Link>
    </div>
  );
};
