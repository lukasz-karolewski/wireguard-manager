import { ClipboardIcon } from "@heroicons/react/24/outline";
import { notFound } from "next/navigation";
import { FC } from "react";
import { api } from "~/trpc/react";

type ServerConfigProps = {
  // config: GlobalConfig;
  server_name: string;
};

export const ServerConfigView: FC<React.PropsWithChildren<ServerConfigProps>> = ({
  // config,
  server_name,
}) => {
  const server = api.site.get.useQuery({ id: Number(server_name) });
  if (!server) return notFound();

  // const configText = printServerConfig(config, server);

  async function copyToClipboard() {
    // configText && (await navigator.clipboard.writeText(configText));
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

      {/* <pre className="overflow-auto bg-gray-600 p-2 text-white">{configText}</pre> */}
    </>
  );
};
