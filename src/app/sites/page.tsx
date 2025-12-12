"use client";

import NiceModal from "@ebay/nice-modal-react";

import { AddEditSiteModal } from "~/components/app/AddEditSiteModal";
import { SiteGrid } from "~/components/app/SiteGrid";
import { Button } from "~/components/ui/button";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/react";

export default function SiteListPage() {
  const { data: sites, isPending, refetch } = api.site.getAll.useQuery();

  async function showAddSiteModal() {
    await NiceModal.show(AddEditSiteModal);
    refetch();
  }

  return (
    <>
      <PageHeader title={`Sites`}>
        <Button onClick={showAddSiteModal}>Add</Button>
      </PageHeader>

      <SiteGrid isLoading={isPending} sites={sites ?? []} />
    </>
  );
}
