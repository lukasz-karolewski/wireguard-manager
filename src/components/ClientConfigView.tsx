import { Switch } from "@headlessui/react";
import { QRCodeSVG } from "qrcode.react";
import { FC, useState } from "react";
import { ClientConfig } from "~/types";
import { useConfig } from "~/providers/configProvider";
import { clientConfigTemplate } from "~/utils/common";

type ClientConfigProps = {
  client: ClientConfig;
};

export const ClientConfigView: FC<React.PropsWithChildren<ClientConfigProps>> = ({ client }) => {
  const { config } = useConfig();
  if (!config) return <></>

  const [show, setShowConfig] = useState<"qr" | "config">("qr");

  return (
    <div className="bg-gray-100 justify-evenly mb-2 last:mb-0 overflow-auto">
      <Switch
        checked={show === "qr"}
        onChange={(v: boolean) => {
          setShowConfig(v ? "qr" : "config");
        }}
        className={`${
          show ? "bg-blue-600" : "bg-gray-200"
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span className="sr-only">{show === "config" ? "Show QR" : "Raw config"}</span>
        <span
          className={`${
            show ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white`}
        />
      </Switch>

      <div className="p-2  bg-blue-100  overflow-auto">
          <div className="grid grid-cols-2">
            <ul>
              <li className="font-bold">{client.name}</li>
              {config.servers.map((server) => {
                return <div >
                  <p>{server.name}</p>
                  <pre className="m-2 p-4 bg-red-400">
                    {clientConfigTemplate(server, client, "allTraffic")}
                    {show == "qr" && <QRCodeSVG value={clientConfigTemplate(server, client, "allTraffic")} size={256} />}
                   </pre>

                   <pre className="m-2 p-4 bg-red-400">
                    {clientConfigTemplate(server, client, "localOnly")}
                    {show == "qr" && <QRCodeSVG value={clientConfigTemplate(server, client, "localOnly")} size={256} />}
                   </pre>
                </div>
              })}
            </ul>
          </div>
      </div>
    </div>
  );
};
