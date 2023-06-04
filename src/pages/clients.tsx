import { useState } from "react";
import useSwr from "swr";
import { ClientConfigView } from "~/components/ClientConfigView";
import EditClientForm from "~/components/ClientForm";
import EditServerForm from "~/components/ServerForm";
import { Button, Layout } from "~/components/ui";
import { ClientConfig, GlobalConfig, ServerConfig } from "~/types";
import apiClient from "~/utils/apiClient";

export default function Home() {
  const { data: config, isLoading } = useSwr<GlobalConfig>("/api/loadConfig");

  const [showForm, setShowForm] = useState(false);

  const onSubmit = async (data: ClientConfig) => {
    const newClient: ClientConfig = {
      name: data.name,

      for_server: {
        ...data.for_server,
      },
      for_client: {
        ...data.for_client,
      },
    };

    const newConfig: GlobalConfig = {
      ...config,
      servers: [...config.servers],
      clients: [...config.clients, newClient],
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

      {config?.clients?.map((server) => {
        return <ClientConfigView key={server.name} config={config} server_name={server.name} />;
      })}
    </Layout>
  );
}
