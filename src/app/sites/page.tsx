"use client";

import NiceModal from "@ebay/nice-modal-react";
import { AddEditSiteModal } from "~/components/app/AddEditSiteModal";
import { SiteItem } from "~/components/app/SiteItem";
import { Button } from "~/components/ui/button";
import PageHeader from "~/components/ui/page-header";

import { api } from "~/trpc/react";

export default function SiteListPage() {
  const { data: sites, isLoading, refetch } = api.site.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  async function showAddSiteModal() {
    await NiceModal.show(AddEditSiteModal);
    refetch();
  }

  return (
    <>
      <PageHeader title={`Sites`}>
        <Button onClick={showAddSiteModal}>Add Site</Button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4">
        {sites
          ?.sort((a, b) => (a.isDefault ? -1 : 1))
          .map((site) => {
            return <SiteItem key={site.id} site={site} />;
          })}

        {sites?.length == 0 && <div>No sites</div>}
      </div>
    </>
  );
}
