import { ClipboardIcon } from "@heroicons/react/20/solid";
import { FC } from "react";
import { ServerConfig, ClientConfig } from "~/pages/api/model/types";
import { printConfig } from "~/utils/common";

type ServerConfigProps = {
  config: ServerConfig;
  clients: ClientConfig[];
};

export const ServerConfigView: FC<React.PropsWithChildren<ServerConfigProps>> = ({
  config,
  clients,
}) => {
  const configText = printConfig(config, clients);

  async function copyToClipboard() {
    await navigator.clipboard.writeText(configText);
  }

  return (
    <div className="p-4 bg-gray-50">
      <div className="flex justify-between items-center">
        <h3 className="text-lg">{config.name}</h3>

        <div className="flex">
          {/* <button className="flex items-center p-2 bg-white hover:bg-slate-100" onClick={copyToClipboard}><PencilIcon className="w-4" /></button> */}
          <button
            className="flex items-center p-2 bg-white hover:bg-slate-100"
            onClick={copyToClipboard}
          >
            <ClipboardIcon className="w-4" />
          </button>
        </div>
      </div>

      <pre className="text-white bg-gray-600 p-2 overflow-auto">{configText}</pre>
    </div>
  );
};
