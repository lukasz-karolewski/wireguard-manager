import { FC } from "react";

import { AddClientButton } from "~/components/app/AddClientButton";
import { ClientFilter } from "~/components/app/ClientFilter";
import { ClientGrid } from "~/components/app/ClientGrid";
import { ClientSearch } from "~/components/app/ClientSearch";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/server";

interface ClientListPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const ClientListPage: FC<ClientListPageProps> = async ({ searchParams }) => {
  const { search, showOnlyMine } = await searchParams;
  const searchValue = typeof search === "string" ? search : "";
  const showOnlyMineValue = showOnlyMine !== "false"; // default to true

  const clients = await api.client.getAll.query({
    search: searchValue,
    showOnlyMine: showOnlyMineValue,
  });

  return (
    <>
      <PageHeader title="Clients">
        <ClientFilter />
        <div className="mx-4 h-full border-l border-gray-300"></div>
        <ClientSearch defaultValue={searchValue} />
        <div className="mx-4 h-full border-l border-gray-300"></div>
        <AddClientButton />
      </PageHeader>

      <ClientGrid clients={clients} />
    </>
  );
};

export default ClientListPage;
