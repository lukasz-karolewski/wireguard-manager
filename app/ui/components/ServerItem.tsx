import { FC } from "react";
import { ServerConfig } from "~/app/lib/types";

type ServerConfigProps = {
  server: ServerConfig;
};

export const ServerItem: FC<React.PropsWithChildren<ServerConfigProps>> = ({ server }) => {
  return <div className="bg-gray-100 p-4">{server.name}</div>;
};
