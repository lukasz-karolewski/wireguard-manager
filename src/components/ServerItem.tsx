import { FC } from "react";
import { ServerConfig } from "~/types";
import { Link } from "./ui";

type ServerConfigProps = {
  server: ServerConfig;
};

export const ServerItem: FC<React.PropsWithChildren<ServerConfigProps>> = ({ server }) => {
  return (
    <div className="p-4 bg-gray-50">
      <Link href={`/servers/${server.name}`}>{server.name}</Link>
    </div>
  );
};
