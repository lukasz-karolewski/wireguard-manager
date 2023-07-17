import { Switch } from "@headlessui/react";
import { QRCodeSVG } from "qrcode.react";
import { FC, useState } from "react";
import { useConfig } from "~/providers/configProvider";
import { clientConfigTemplate, configTypes } from "~/utils/common";

import { useRouter } from "next/router";
import { Layout } from "~/components/ui";

const ClientConfigView: FC = () => {
  const { config } = useConfig();
  const router = useRouter()
  if (!config) return <></>

  const id = Number(router.query['id'])
  const client = config.clients.find((val) => val.id == id)
  if (!client) return <></>

  const [show, setShowConfig] = useState<"qr" | "config">("qr");

  return (
    <Layout>
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
                    {configTypes.map((variant) => {
                      const config = clientConfigTemplate(server, client, variant)

                      return <div>
                        {variant}
                        {show == "config" && <pre className="m-2 p-4 bg-red-400">{config}</pre>}
                        {show == "qr" && <QRCodeSVG value={config} size={256} />}
                      </div>
                    })}
                </div>
              })}
            </ul>
          </div>
      </div>
    </div>
    </Layout>
  );
};

export default ClientConfigView;