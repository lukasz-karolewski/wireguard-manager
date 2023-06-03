import { useEffect, useState } from "react";
import { ServerConfigView } from "~/components/ServerConfig";
import { Button, Layout } from "~/components/ui";
import { getServers } from "~/utils/apiClient";
import { ServerConfig } from "~/types";

export default function Home() {
  const [servers, setServers] = useState<ServerConfig[]>([]);

  useEffect(() => {
    getServers().then((d) => {
      setServers(d);
    });
  });

  function addServer() {}

  return (
    <Layout>
      <Button onClick={addServer}>Add Server</Button>

      {servers.map((s) => (
        <ServerConfigView config={s} clients={[]}></ServerConfigView>
      ))}
    </Layout>
  );
}
