import { FC } from "react";

import { useRouter } from "next/router";
import useSwr from "swr";
import { ServerConfigView } from "~/components/ServerConfigView";
import { Layout, Link } from "~/components/ui";
import { GlobalConfig } from "~/types";

const ServerDetailPage: FC = () => {
  const router = useRouter();
  const server_name = router.query["name"];

  const { data: config, isLoading } = useSwr<GlobalConfig>("/api/loadConfig");
  if (!config) return <></>;

  const server = config.servers.find((val) => val.name == server_name);
  if (!server) return <></>;

  return (
    <Layout>
      <h3 className="text-lg">
        <Link href="/servers">Servers</Link> &gt; {server_name}
      </h3>
      <ServerConfigView config={config} server_name={server.name} />
    </Layout>
  );
};

export default ServerDetailPage;