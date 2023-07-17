import { useState } from "react";
import useSwr from "swr";
import { ClientConfigView } from "~/components/ClientConfigView";
import EditClientForm from "~/components/ClientForm";
import { Button, Layout } from "~/components/ui";
import { useConfig } from "~/providers/configProvider";
import { ClientConfig, GlobalConfig } from "~/types";
import apiClient from "~/utils/apiClient";

export default function Home() {
  const { config } = useConfig();

  const [showForm, setShowForm] = useState(false);

  const onSubmit = async (data: ClientConfig) => {
    const newConfig: GlobalConfig = {
      ...config,
      servers: [...config.servers],
      clients: [...config.clients, data],
    };

    apiClient.saveConfig(newConfig).then(() => {
      setShowForm(false);
    });
  };

  return (
    <Layout>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Client"}
        </Button>
      </div>

      {showForm && <EditClientForm onSubmit={onSubmit} />}

      {config?.clients?.map((client) => {
        return <ClientConfigView key={client.name} client={client} />;
      })}
    </Layout>
  );
}
