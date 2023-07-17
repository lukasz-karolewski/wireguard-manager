import { ClipboardIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import { ServerConfig, ClientConfig, GlobalConfig } from "~/types";
import { printServerConfig } from "~/utils/common";
import { Link } from "./ui";

type ServerConfigProps = {
  config: GlobalConfig;
  server_name: string;
};

export const ServerItem: FC<React.PropsWithChildren<ServerConfigProps>> = ({
  config,
  server_name,
}) => {

  const server = config.servers.find((s) => s.name === server_name);
  return (
    <div className="p-4 bg-gray-50">
        <Link href={`servers\${server.server_name}`} >{server_name}</Link>
    </div>
  );
};
