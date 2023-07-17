import { ServerConfigView } from "~/components/ServerConfigView";
import { Button, Layout } from "~/components/ui";
import { GlobalConfig, ServerConfig } from "~/types";

import { useState } from "react";
import EditServerForm from "~/components/ServerForm";
import apiClient from "~/utils/apiClient";
import { useConfig } from "~/providers/configProvider";

export default function Home() {
  const { config } = useConfig();

  const [showForm, setShowForm] = useState(false);

  const onSubmit = async (data: ServerConfig) => {
    const newServer: ServerConfig = {
      name: data.name,
      mode: data.mode,
      deployment: "file",
      deployment_target: "wg0.conf",

      for_server: {
        ...data.for_server,
      },
      for_client: {
        ...data.for_client,
      },
    };

    const newConfig: GlobalConfig = {
      ...config,
      servers: [...config.servers, newServer],
      clients: [...config.clients],
    };

    apiClient.saveConfig(newConfig).then(() => {
      setShowForm(false);
    });
  };

  return (
    <Layout>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Server"}
        </Button>
      </div>

      {showForm && <EditServerForm onSubmit={onSubmit} />}

      {config?.servers?.map((server) => {
        return <ServerConfigView key={server.name} config={config} server_name={server.name} />;
      })}
    </Layout>
  );
}
