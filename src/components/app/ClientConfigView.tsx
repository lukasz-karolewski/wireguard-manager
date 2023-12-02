import { FC } from "react";

type ClientConfigProps = {
  show: "qr" | "config";
};

export const ClientConfigView: FC<React.PropsWithChildren<ClientConfigProps>> = ({ show }) => {
  return (
    <div className="flex gap-4 overflow-auto">
      {/* {configTypes.map((variant) => {
        const config = clientConfigTemplate(server, client, variant);

        return (
          <div key={variant}>
            {variant}

            {show == "config" && <pre className="m-2 bg-red-400 p-4">{config}</pre>}
            {show == "qr" && <QRCodeSVG value={config} size={256} />}
          </div>
        );
      })} */}
    </div>
  );
};
