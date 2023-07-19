import { Button, Layout, Link } from "~/components/ui";
import { GlobalConfig, ServerConfig } from "~/types";

import { useState } from "react";
import EditServerForm from "~/components/ServerForm";
import { ServerItem } from "~/components/ServerItem";
import { useConfig } from "~/providers/configProvider";
import apiClient from "~/utils/apiClient";

export default function Home() {
  const { config } = useConfig();
  const [showForm, setShowForm] = useState(false);

  if (!config) return <></>;
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
      <div className="grid grid-cols-4 gap-4">
        {config?.servers?.map((server) => {
          return (
            <Link key={server.name} href={`/servers/${server.name}`}>
              <ServerItem server={server} />
            </Link>
          );
        })}
      </div>
    </Layout>
  );
}
