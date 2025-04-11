import { FC } from "react";

import type { RouterOutputs } from "~/trpc/shared";

import { ClientItem } from "./ClientItem";

interface ClientGridProps {
  clients: RouterOutputs["client"]["getAll"];
}

export const ClientGrid: FC<ClientGridProps> = ({ clients }) => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {clients.map((client) => (
          <ClientItem client={client} key={client.id} />
        ))}
      </div>
      {clients.length === 0 && (
        <div className="flex items-center justify-center py-12">No Clients</div>
      )}
    </>
  );
};
