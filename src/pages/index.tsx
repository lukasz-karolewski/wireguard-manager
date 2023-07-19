import NiceModal from "@ebay/nice-modal-react";
import AddClientModal from "~/components/AddClientModal";
import { ClientItem } from "~/components/ClientItem";
import { Button, Layout } from "~/components/ui";
import { useConfig } from "~/providers/configProvider";

export default function Home() {
  const { config } = useConfig();

  return (
    <Layout>
      <div className="flex justify-end mb-4">
        <Button onClick={() => NiceModal.show(AddClientModal)}>Add Client</Button>
      </div>

      <input className="border" />

      {config?.clients?.map((client) => {
        return <ClientItem key={client.name} client={client} />;
      })}
    </Layout>
  );
}
