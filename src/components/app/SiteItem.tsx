import { clsx } from "clsx";
import { FC } from "react";
// import { toast } from "react-hot-toast";

// import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";

import Link from "../ui/link";

interface SiteConfigProps {
  site: NonNullable<RouterOutputs["site"]["getAll"][number]>;
}

export const SiteItem: FC<SiteConfigProps> = ({ site }) => {
  return (
    <Link href={`/sites/${site.id}#${site.name}`} key={site.name}>
      <div className={clsx("bg-gray-100 p-4", { "bg-green-300": site.isDefault })}>
        <h2>{site.name}</h2>
        {site.endpointAddress}
        <div>Assigned network: {site.assignedNetwork}</div>
        {site.hostname && <div>Hostname: {site.hostname}</div>}
      </div>
    </Link>
  );
};
