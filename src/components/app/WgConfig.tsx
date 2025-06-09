import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { QRCodeSVG } from "qrcode.react";
import { FC } from "react";

import { Button } from "~/components/ui/button";
import { clientConfigToString, type ClientConfigType } from "~/server/utils/types";

interface WgConfigProps {
  clientName: string;
  config: { type: ClientConfigType; value: string };
  show: "config" | "qr";
}

function download(filename: string, text: string) {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.append(element);
  element.click();
  element.remove();
}

const WgConfig: FC<WgConfigProps> = ({ clientName, config, show }) => {
  const filename = `${clientName}-${config.type}.conf`;
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gray-50/50 border-b border-gray-100">
        <h4 className="font-medium text-gray-900">{clientConfigToString(config.type)}</h4>
        <Button
          onClick={() => {
            download(filename, config.value);
          }}
          size="sm"
          variant="ghost"
        >
          <DocumentArrowDownIcon className="size-4" />
        </Button>
      </div>
      <div className="p-4 flex items-center justify-center min-h-[200px]">
        {show === "config" && (
          <pre className="text-xs text-gray-700 bg-gray-50 p-3 rounded border overflow-x-auto w-full">
            {config.value}
          </pre>
        )}
        {show === "qr" && (
          <div className="p-4">
            <QRCodeSVG size={180} value={config.value} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WgConfig;
