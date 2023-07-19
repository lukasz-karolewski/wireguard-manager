import { ClipboardIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import { GlobalConfig } from "~/types";
import { printServerConfig } from "~/utils/common";

type ServerConfigProps = {
  config: GlobalConfig;
  server_name: string;
};

export const ServerConfigView: FC<React.PropsWithChildren<ServerConfigProps>> = ({
  config,
  server_name,
}) => {
  const server = config.servers.find((s) => s.name === server_name);
  if (!server) return <></>;

  const configText = printServerConfig(config, server);

  async function copyToClipboard() {
    await navigator.clipboard.writeText(configText);
  }

  return (
    <>
      <div className="flex justify-between items-center">
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
    </>
  );
};
