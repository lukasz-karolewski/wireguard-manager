import type { FC } from "react";

import { ClientDetail } from "~/components/app/ClientDetail";
import { api } from "~/trpc/server";

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

const ClientDetailPage: FC<ClientDetailPageProps> = async ({ params }) => {
  const { id } = await params;
  const [clientData, sites] = await Promise.all([api.client.get.query({ id: Number(id) }), api.site.getAll.query()]);

  return <ClientDetail clientData={clientData} sites={sites} />;
};

export default ClientDetailPage;
