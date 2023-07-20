import { QRCodeSVG } from "qrcode.react";
import { FC } from "react";
import { ClientConfig, ServerConfig } from "~/types";

import { clientConfigTemplate, configTypes } from "~/utils/common";

type ClientConfigProps = {
  server: ServerConfig;
  client: ClientConfig;
  show: "qr" | "config";
};

export const ClientConfigView: FC<React.PropsWithChildren<ClientConfigProps>> = ({
  server,
  client,
  show,
}) => {
  return (
    <div className="flex gap-4 overflow-auto">
      {configTypes.map((variant) => {
        const config = clientConfigTemplate(server, client, variant);

        return (
          <div key={variant}>
            {variant}

            {show == "config" && <pre className="m-2 bg-red-400 p-4">{config}</pre>}
            {show == "qr" && <QRCodeSVG value={config} size={256} />}
          </div>
        );
      })}
    </div>
  );
};
