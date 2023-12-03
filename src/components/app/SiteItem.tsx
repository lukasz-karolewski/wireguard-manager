import { FC } from "react";

import clsx from "clsx";
import { RouterOutputs } from "~/trpc/shared";
import Link from "../ui/link";

type SiteConfigProps = {
  site: NonNullable<RouterOutputs["site"]["getAll"][number]>;
};

export const SiteItem: FC<SiteConfigProps> = ({ site }) => {
  return (
    <div className={clsx("bg-gray-100 p-4", { "bg-green-300": site.isDefault })}>
      <Link key={site.name} href={`/sites/${site.id}#${site.name}`}>
        <h2>{site.name}</h2>
        {site.endpointAddress}
        <div>Assigned network: {site.assignedNetwork}</div>
      </Link>
    </div>
  );
};
