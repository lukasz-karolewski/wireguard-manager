import { FC } from "react";
import { ClientConfig } from "~/types";

type ClientConfigProps = {
  client: ClientConfig;
};

export const ClientItem: FC<React.PropsWithChildren<ClientConfigProps>> = ({ client }) => {
  return <div className="bg-gray-100 p-4">{client.name}</div>;
};
