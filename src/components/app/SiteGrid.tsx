import { FC } from "react";

import type { RouterOutputs } from "~/trpc/shared";

import { SiteItem } from "./SiteItem";

interface SiteGridProps {
  sites: (RouterOutputs["site"]["getAll"][number] & {
    needsUpdate?: boolean;
    remoteConfigCheckedAt?: Date | null;
    remoteConfigHash?: null | string;
  })[];
}

export const SiteGrid: FC<SiteGridProps> = ({ sites }) => {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sites
          .sort((a, _b) => (a.isDefault ? -1 : 1))
          .map((site) => (
            <SiteItem key={site.id} site={site} />
          ))}
      </div>
      {sites.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <svg
            className="w-16 h-16 mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3V6a3 3 0 013-3h13.5a3 3 0 013 3v5.25a3 3 0 01-3 3m-13.5 0V21a3 3 0 003 3h7.5a3 3 0 003-3v-6.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
            />
          </svg>
          <p className="text-lg font-medium">No sites yet</p>
          <p className="text-sm mt-1">Create your first WireGuard site to get started</p>
        </div>
      )}
    </>
  );
};
