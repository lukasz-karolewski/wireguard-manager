import { FC } from "react";

import type { RouterOutputs } from "~/trpc/shared";

import { ClientItem } from "./ClientItem";

interface ClientGridProps {
  clients: RouterOutputs["client"]["getAll"];
}

export const ClientGrid: FC<ClientGridProps> = ({ clients }) => {
  return (
    <>
      <div className="grid w-full min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {clients.map((client) => (
          <div className="min-w-0" key={client.id}>
            <ClientItem client={client} />
          </div>
        ))}
      </div>
      {clients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <svg
            className="w-16 h-16 mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
            />
          </svg>
          <p className="text-lg font-medium">No clients yet</p>
          <p className="text-sm mt-1">Create your first WireGuard client to get started</p>
        </div>
      )}
    </>
  );
};
