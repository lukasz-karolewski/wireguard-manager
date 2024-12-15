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
    search: searchParams.get("search") ?? "",
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
            autoFocus={true}
            defaultValue={searchParams.get("search") ?? ""}
            name="search"
            placeholder="Search"
            type="text"
          />
        </form>
        <div className="mx-4 h-full border-l border-gray-300"></div>
        <Button onClick={showAddClientModal}>Add</Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3">
        {clients?.map((client) => {
          return <ClientItem client={client} key={client.id} />;
        })}
      </div>
      {clients?.length == 0 && (
        <div className="flex items-center justify-center py-12">No Clients</div>
      )}
    </>
  );
};
export default ClientListPage;
