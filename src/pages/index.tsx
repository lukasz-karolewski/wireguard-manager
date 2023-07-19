import NiceModal from "@ebay/nice-modal-react";
import { useState } from "react";
import AddClientModal from "~/components/AddClientModal";
import { ClientItem } from "~/components/ClientItem";
import { Button, Layout, Link } from "~/components/ui";
import { useConfig } from "~/providers/configProvider";

export default function Home() {
  const { config } = useConfig();

  const [filter, setFilter] = useState("");
  const filteredClients = config?.clients?.filter((client) =>
    client.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <Layout>
      <div className="flex justify-end mb-4">
        <Button onClick={() => NiceModal.show(AddClientModal)}>Add Client</Button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
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
