import { FC } from "react";

import clsx from "clsx";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";
import { Button } from "../ui/button";
import Link from "../ui/link";

type SiteConfigProps = {
  site: NonNullable<RouterOutputs["site"]["getAll"][number]>;
};

export const SiteItem: FC<SiteConfigProps> = ({ site }) => {
  const { mutate: writeConfig, isLoading: isPosting } = api.site.writeSiteConfigToDisk.useMutation(
    {
      onSuccess: (ret) => {
        switch (ret) {
          case "no_changes":
            toast.success("No changes");
            break;
          case "written":
            toast.success("Config written");
            break;
        }
      },
      onError: (err) => {
        toast.error(err.message);
      },
    },
  );

  return (
    <div className={clsx("bg-gray-100 p-4", { "bg-green-300": site.isDefault })}>
      <Link key={site.name} href={`/sites/${site.id}#${site.name}`}>
        <h2>{site.name}</h2>
        {site.endpointAddress}
        <div>Assigned network: {site.assignedNetwork}</div>
      </Link>
      {site.isDefault && (
        <Button
          disabled={isPosting}
          onClick={() => {
            writeConfig({ id: site.id });
          }}
          className="mt-2"
        >
          Write config
        </Button>
      )}
    </div>
  );
};