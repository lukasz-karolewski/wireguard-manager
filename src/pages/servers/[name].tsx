import { FC } from "react";
import { useConfig } from "~/providers/configProvider";

import { useRouter } from "next/router";
import { Layout, Link } from "~/components/ui";
import { ServerConfigView } from "~/components/ServerConfigView";

const ServerDetailPage: FC = () => {
  const router = useRouter();
  const server_name = router.query["name"];

  const { config } = useConfig();
  if (!config) return <></>;

  const server = config.servers.find((val) => val.name == server_name);
  if (!server) return <></>;

  return (
    <Layout>
      <Link href="/servers">Back</Link>
      <div className="bg-gray-100 justify-evenly mb-2 last:mb-0 overflow-auto">
        <div className="p-2  bg-blue-100  overflow-auto">
          <ServerConfigView config={config} server_name={server.name} />
        </div>
      </div>
    </Layout>
  );
};

export default ServerDetailPage;
