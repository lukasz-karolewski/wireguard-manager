import { FC } from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import useSwr from "swr";
import { ServerConfigView } from "~/components/app/ServerConfigView";
import { GlobalConfig } from "~/server/utils/types";

type ServerDetailPageProps = { params: { name: string } };

const ServerDetailPage: FC<ServerDetailPageProps> = (params) => {
  const router = useRouter();
  const server_name = router.query["name"];

  const { data: config, isLoading } = useSwr<GlobalConfig>("/api/loadConfig");
  if (!config) return <></>;

  const server = config.servers.find((val) => val.name == server_name);
  if (!server) return <></>;

  return (
    <>
      <h3 className="text-lg">
        <Link href="/servers">Servers</Link> &gt; {server_name}
      </h3>
      <ServerConfigView config={config} server_name={server.name} />
    </>
  );
};

export default ServerDetailPage;
