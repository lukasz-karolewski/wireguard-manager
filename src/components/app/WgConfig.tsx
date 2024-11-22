import { FC } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "~/components/ui/button";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { clientConfigToString, type ClientConfigType } from "~/server/utils/types";

type WgConfigProps = {
  config: { type: ClientConfigType; value: string };
  clientName: string;
  show: "qr" | "config";
};

const WgConfig: FC<WgConfigProps> = ({ config, clientName, show }) => {
  const download = (device_name: string, variant: ClientConfigType, text: string) => {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", `${device_name}-${variant}.conf`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h3>{clientConfigToString(config.type)}</h3>
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => download(clientName, config.type, config.value)}
        >
          <DocumentArrowDownIcon className="size-5" />
        </Button>
      </div>
      {show == "config" && <pre>{config.value}</pre>}
      {show == "qr" && <QRCodeSVG value={config.value} size={256} />}
    </div>
  );
};

export default WgConfig;
