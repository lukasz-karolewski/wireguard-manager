"use client";

import NiceModal from "@ebay/nice-modal-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";
import { AddEditClientModal } from "~/components/app/AddEditClientModal";
import { ClientItem } from "~/components/app/ClientItem";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/react";
import { createUrl } from "~/utils";

interface ClientListPageParams {}

const ClientListPage: FC<ClientListPageParams> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: clients, refetch } = api.client.getAll.useQuery({
    search: searchParams?.get("search") ?? "",
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParms = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParms.set("search", search.value);
    } else {
      newParms.delete("search");
    }

    router.push(createUrl("/", newParms));
  }

  async function showAddClientModal() {
    await NiceModal.show(AddEditClientModal);
    refetch();
  }
  return (
    <>
      <PageHeader title="Clients">
        <form onSubmit={onSubmit}>
          <Input
            name="search"
            placeholder="Search"
            autoFocus={true}
            type="text"
            defaultValue={searchParams?.get("search") ?? ""}
          />
        </form>
        <Button onClick={showAddClientModal}>Add Client</Button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4">
        {clients?.map((client) => {
          return <ClientItem key={client.id} client={client} />;
        })}

        {clients?.length == 0 && <div>No Clients</div>}
      </div>
    </>
  );
};
export default ClientListPage;
