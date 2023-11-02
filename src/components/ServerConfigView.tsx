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
      <div className="flex items-center justify-between">
        <div className="flex">
          {/* <button className="flex items-center p-2 bg-white hover:bg-slate-100" onClick={copyToClipboard}><PencilIcon className="w-4" /></button> */}
          <button
            className="flex items-center bg-white p-2 hover:bg-slate-100"
            onClick={copyToClipboard}
          >
            <ClipboardIcon title="Copy to Clipboard" className="w-4" />
          </button>
        </div>
      </div>

      <pre className="overflow-auto bg-gray-600 p-2 text-white">{configText}</pre>
    </>
  );
};