import { AddSiteButton } from "~/components/app/AddSiteButton";
import { SiteGrid } from "~/components/app/SiteGrid";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/server";

export default async function SiteListPage() {
  const sites = await api.site.getAll.query();

  return (
    <>
      <PageHeader title={`Sites`}>
        <AddSiteButton />
      </PageHeader>

      <SiteGrid sites={sites} />
    </>
  );
}
