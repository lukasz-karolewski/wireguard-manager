import { Client } from "@prisma/client";
import { FC } from "react";

type ClientConfigProps = {
  client: Client;
};

export const ClientItem: FC<React.PropsWithChildren<ClientConfigProps>> = ({ client }) => {
  return <div className="bg-gray-100 p-4">{client.name}</div>;
};
