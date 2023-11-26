"use client";

// import NiceModal from "@ebay/nice-modal-react";
// import AddServerModal from "~/components/app/AddServerModal";
import { ServerItem } from "~/components/app/ServerItem";
// import Button from "~/components/ui/button";
import Link from "~/components/ui/link";

import { api } from "~/trpc/react";

export default function SiteListPage() {
  const { data: sites, isLoading } = api.site.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="mb-4 flex justify-end">
        {/* <Button onClick={() => NiceModal.show(AddServerModal)}>Add Server</Button> */}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {sites?.map((site) => {
          return (
            <Link key={site.name} href={`/sites/${site.id}`}>
              <ServerItem site={site} />
            </Link>
          );
        })}
      </div>
    </>
  );
}
