import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef, useState } from "react";
import useSwr from "swr";
import AddClientModal from "~/components/AddClientModal";
import { ClientItem } from "~/components/ClientItem";
import { Button, Layout, Link } from "~/components/ui";
import { GlobalConfig } from "~/types";

export default function Home() {
  const { data: config, isLoading } = useSwr<GlobalConfig>("/api/loadConfig");

  const [filter, setFilter] = useState("");
  const filteredClients = config?.clients?.filter((client) =>
    client.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on the input element when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Layout>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => NiceModal.show(AddClientModal)}>Add Client</Button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 sm:text-sm"
          ref={inputRef}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {filteredClients?.map((client) => {
          return (
            <Link key={client.name} href={`clients/${client.id}`}>
              <ClientItem client={client} />
            </Link>
          );
        })}
      </div>
    </Layout>
  );
}
