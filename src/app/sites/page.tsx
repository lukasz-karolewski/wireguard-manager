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
        <Button onClick={showAddSiteModal}>Add</Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3">
        {sites
          ?.sort((a, b) => (a.isDefault ? -1 : 1))
          .map((site) => {
            return <SiteItem key={site.id} site={site} />;
          })}
      </div>

      {sites?.length == 0 && (
        <div className="flex items-center justify-center py-12">No Sites</div>
      )}
    </>
  );
}
