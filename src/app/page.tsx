"use client";

import NiceModal from "@ebay/nice-modal-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";
import AddClientModal from "~/components/app/AddClientModal";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import Link from "~/components/ui/link";
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
    await NiceModal.show(AddClientModal);
    refetch();
  }
  return (
    <>
      <div className="mb-4 flex justify-center gap-2">
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
      </div>

      <div className="grid grid-cols-4 gap-4">
        {clients?.map((client) => {
          return (
            <Link key={client.name} href={`/clients/${client.id}`}>
              {client.name}
            </Link>
          );
        })}

        {clients?.length == 0 && <div>No Clients</div>}
      </div>
    </>
  );
};
export default ClientListPage;

//       <div className="mb-4 flex justify-end">
//         <Button onClick={() => NiceModal.show(AddClientModal)}>Add Client</Button>
//       </div>

//       <div className="mb-4">{SearchBox(filter, setFilter)}</div>

//       <div className="grid grid-cols-4 gap-4">
//         {filteredClients?.map((client) => {
//           return (
//             <Link key={client.name} href={`clients/${client.id}`}>
//               <ClientItem client={client} />
//             </Link>
//           );
//         })}
//       </div>
// function SearchBox(filter: string, setFilter) {
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     // Focus on the input element when the component mounts
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, []);

//   return (
//     <input
//       type="text"
//       placeholder="Filter by name"
//       value={filter}
//       onChange={(e) => setFilter(e.target.value)}
//
//       ref={inputRef}
//     />
//   );
// }
