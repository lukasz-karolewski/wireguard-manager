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
  // const { data, refetch } = api.site.get.useQuery({ id: site.id }, { enabled: false });

  // async function copyToClipboard(id: number) {
  //   const update = await refetch();
  //   await navigator.clipboard.writeText(update.data?.config ?? "");
  //   toast.success("Copied config to clipboard");
  // }

  return (
    <Link href={`/sites/${site.id}#${site.name}`} key={site.name}>
      <div className={clsx("bg-gray-100 p-4", { "bg-green-300": site.isDefault })}>
        <h2>{site.name}</h2>
        {site.endpointAddress}
        <div>Assigned network: {site.assignedNetwork}</div>

        {/* <div className="mt-4 flex items-center gap-2">
          {!site.isDefault && (
            <Button
              onClick={() => {
                copyToClipboard(site.id);
              }}
              variant="link"
              size="inline"
            >
              Copy config
            </Button>
          )}
          <Button
            onClick={async () => {
              await NiceModal.show(AddEditSiteModal, { site: mapSiteForEdit(site) });
              refetch();
            }}
          >
            Edit
          </Button>
        </div> */}
      </div>
    </Link>
  );
};
