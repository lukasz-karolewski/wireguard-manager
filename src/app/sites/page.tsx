"use client";

import NiceModal from "@ebay/nice-modal-react";
import AddSiteModal from "~/components/app/AddSiteModal";
import { ServerItem } from "~/components/app/ServerItem";
import { Button } from "~/components/ui/button";
import Link from "~/components/ui/link";

import { api } from "~/trpc/react";

export default function SiteListPage() {
  const { data: sites, isLoading, refetch } = api.site.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  async function showAddSiteModal() {
    await NiceModal.show(AddSiteModal);
    refetch();
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={showAddSiteModal}>Add Site</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {sites?.map((site) => {
          return (
            <Link key={site.name} href={`/sites/${site.id}#${site.name}`}>
              <ServerItem site={site} />
            </Link>
          );
        })}

        {sites?.length == 0 && <div>No sites</div>}
      </div>
    </>
  );
}
