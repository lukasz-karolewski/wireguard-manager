import type { FC } from "react";

import { SiteDetail } from "~/components/app/SiteDetail";
import { api } from "~/trpc/server";

interface SiteDetailPageProps {
  params: Promise<{ id: string }>;
}

const SiteDetailPage: FC<SiteDetailPageProps> = async ({ params }) => {
  const { id } = await params;
  const data = await api.site.get.query({ id: Number(id) });

  return <SiteDetail data={data} />;
};

export default SiteDetailPage;
