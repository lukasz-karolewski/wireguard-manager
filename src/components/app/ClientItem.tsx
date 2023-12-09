import NiceModal from "@ebay/nice-modal-react";
import { Client } from "@prisma/client";
import clsx from "clsx";
import { FC } from "react";
import Link from "~/components/ui/link";
import { Button } from "../ui/button";
import { AddEditClientModal, mapClientForEdit } from "./AddEditClientModal";

type ClientConfigProps = {
  client: Client;
};

export const ClientItem: FC<React.PropsWithChildren<ClientConfigProps>> = ({ client }) => {
  return (
    <div
      className={clsx(" flex items-center justify-between p-4", {
        "bg-gray-100": client.enabled,
        "bg-gray-100/50": !client.enabled,
      })}
    >
      <Link key={client.name} href={`/clients/${client.id}#${client.name}`}>
        {client.name}
        {client.enabled ? "" : " - Disabled"}
      </Link>
      <Button
        variant={"ghost"}
        onClick={async () =>
          await NiceModal.show(AddEditClientModal, {
            client: mapClientForEdit(client),
          })
        }
      >
        Edit
      </Button>
    </div>
  );
};
