import QRCode from "qrcode.react";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [clientId, setClientId] = useState(1);

  const [config_sjc, setConfig_sjc] = useState("");
  const [config_sjc_all_traffic, setConfig_sjc_all_traffic] = useState("");
  const [config_waw, setConfig_waw] = useState("");
  const [config_waw_all_traffic, setConfig_waw_all_traffic] = useState("");

  useEffect(() => {
    updateConfigs(clientId);
  }, [clientId]);

  const sjc_public = "BEGg/cVw0trQmwZvbaf+0JZ1KJkQxnZYlQQSNrx9kGM=";
  const sjc_subnet = (id) => `172.16.1.${id}/16`;

  const waw_public = "BEGg/cVw0trQmwZvbaf+0JZ1KJkQxnZYlQQSNrx9kGM=";
  const waw_subnet = (id) => `172.16.2.${id}/16`;

  function genConfig(subnet, serverPublicKey) {
    return `
        [Interface]
        Address = ${subnet}
        PrivateKey = cKsiUmwzDzcGgLv3pYjPdP2sZGllsziXQW7wx03H9Us=
        DNS = 192.168.2.1

        [Peer]
        PublicKey = ${serverPublicKey}
        AllowedIPs = 192.168.2.0/24
        Endpoint = edgerouter-sjc.duckdns.org:51820`;
  }

  function updateConfigs(clientId) {
    setConfig_sjc(genConfig(sjc_subnet(clientId), sjc_public));
    setConfig_sjc_all_traffic(genConfig(sjc_subnet(clientId), sjc_public));

    setConfig_waw(genConfig(waw_subnet(clientId), waw_public));
    setConfig_waw_all_traffic(genConfig(waw_subnet(clientId), waw_public));
  }

  return (
    <>
      <input
        type="number"
        min={1}
        max={254}
        step={1}
        value={clientId}
        onChange={(event) => {
          setClientId(+event.target.value);
        }}
      />
      <br />
      <pre>{config_sjc}</pre>

      <div className="">
        <QRCode value={config_sjc} />
      </div>
      <div>
        <QRCode value={config_sjc_all_traffic} />
      </div>
      <div>
        <QRCode value={config_waw} />
      </div>
      <div>
        <QRCode value={config_waw_all_traffic} />
      </div>
    </>
  );
}
