import { Switch } from "@headlessui/react";
import { QRCodeSVG } from "qrcode.react";
import { FC, useState } from "react";
import { ClientConfig,  } from "~/types";
import { useConfig } from "~/providers/configProvider";

import {ClientConfigType} from "~/types"
import { Link } from "./ui";

type ClientConfigProps = {
  client: ClientConfig;
};

export const ClientConfigView: FC<React.PropsWithChildren<ClientConfigProps>> = ({ client }) => {
  const { config } = useConfig();
  if (!config) return <></>

  const [show, setShowConfig] = useState<"qr" | "config">("qr");

  return (
    <div className="bg-gray-100 justify-evenly mb-2 last:mb-0 overflow-auto">
      <div className="p-2  bg-blue-100  overflow-auto">
          <div className="grid grid-cols-2">
            <ul>
              <Link className="font-bold" href={`clients/${client.id}`} >{client.name}</Link>
            </ul>
          </div>
      </div>
    </div>
  );
};