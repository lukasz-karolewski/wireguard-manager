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
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h3>{clientConfigToString(config.type)}</h3>
        <Button
          onClick={() => {
            download(filename, config.value);
          }}
          size={"icon"}
          variant={"ghost"}
        >
          <DocumentArrowDownIcon className="size-5" />
        </Button>
      </div>
      {show == "config" && <pre>{config.value}</pre>}
      {show == "qr" && <QRCodeSVG size={256} value={config.value} />}
    </div>
  );
};

export default WgConfig;
