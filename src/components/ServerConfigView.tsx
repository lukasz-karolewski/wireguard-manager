import { ClipboardIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import { ServerConfig, ClientConfig, GlobalConfig } from "~/types";
import { printServerConfig } from "~/utils/common";

type ServerConfigProps = {
  config: GlobalConfig;
  server_name: string;
};

export const ServerConfigView: FC<React.PropsWithChildren<ServerConfigProps>> = ({
  config,
  server_name,
}) => {
  const configText = printServerConfig(config, server_name);
  const server = config.servers.find((s) => s.name === server_name);

  async function copyToClipboard() {
    await navigator.clipboard.writeText(configText);
  }

  return (
    <div className="p-4 bg-gray-50">
      <div className="flex justify-between items-center">
        <h3 className="text-lg">{server_name}</h3>

        <div className="flex">
          {/* <button className="flex items-center p-2 bg-white hover:bg-slate-100" onClick={copyToClipboard}><PencilIcon className="w-4" /></button> */}
          <button
            className="flex items-center p-2 bg-white hover:bg-slate-100"
            onClick={copyToClipboard}
          >
            <ClipboardIcon title="Copy to Clipboard" className="w-4" />
          </button>
        </div>
      </div>

      <pre className="text-white bg-gray-600 p-2 overflow-auto">{configText}</pre>
    </div>
  );
};
