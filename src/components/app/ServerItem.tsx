import { FC } from "react";

import { RouterOutputs } from "~/trpc/shared";

type SiteConfigProps = {
  site: NonNullable<RouterOutputs["site"]["get"]>;
};

export const ServerItem: FC<SiteConfigProps> = ({ site }) => {
  return (
    <div className="bg-gray-100 p-4">
      {site.id} {site.name} {site.endpointAddress}
    </div>
  );
};
