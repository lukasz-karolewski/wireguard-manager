import { Switch } from "@headlessui/react";
import { QRCodeSVG } from "qrcode.react";
import { FC, useState } from "react";
import { ClientConfig } from "~/pages/api/model/types";
import { clientConfigTemplate } from "~/utils/common";

type ClientConfigProps = {
  config: ClientConfig;
};

export const ClientConfigView: FC<React.PropsWithChildren<ClientConfigProps>> = ({ config }) => {
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
        {show == "config" && <pre>{clientConfigTemplate(config)}</pre>}
        {show == "qr" && (
          <div className="grid grid-cols-2">
            <div className="mx-auto">
              <QRCodeSVG value={clientConfigTemplate(config)} size={256} />
            </div>
            <ul>
              <li className="font-bold">{config.name}</li>
              <li>Interface address {config.interface_address}</li>
              <li>Allowed IP's {config.allowed_ips}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
