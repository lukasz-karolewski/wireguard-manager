import QRCode from "qrcode.react";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [clientId, setClientId] = useState(1);
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [description, setDescription] = useState("");

  const [showConfig, setShowConfig] = useState(false);

  const [config_sjc, setConfig_sjc] = useState("");
  const [config_sjc_all_traffic, setConfig_sjc_all_traffic] = useState("");
  const [config_waw, setConfig_waw] = useState("");
  const [config_waw_all_traffic, setConfig_waw_all_traffic] = useState("");

  const [config_sjc_server, setConfig_sjc_server] = useState("");
  const [config_waw_server, setConfig_waw_server] = useState("");

  const sjc_subnet = (id) => `172.16.1.${id}`;
  const sjc_allowed_ips = "192.168.2.0/24";

  const waw_subnet = (id) => `172.16.2.${id}`;
  const waw_allowed_ips = "192.168.20.0/24, 192.168.21.0/24";

  useEffect(() => {
    const sjc = {
      server_public_key: "BEGg/cVw0trQmwZvbaf+0JZ1KJkQxnZYlQQSNrx9kGM=",
      server_endpoint: "edgerouter-sjc.duckdns.org:51820",
      dns: "192.168.2.1",
    };

    const waw = {
      server_public_key: "JS9jXHlQjx/Vl0nYM6qnPIUI/B/EFNq7DzNKb78ctz8=",
      server_endpoint: "edgerouter-waw.duckdns.org:51820",
      dns: "192.168.21.1",
    };

    function clientConfigTemplate(config) {
      return `[Interface]
          Address = ${config.interface_address}
          PrivateKey = ${config.client_private_key}
          DNS = ${config.dns}

          [Peer]
          PublicKey = ${config.server_public_key}
          AllowedIPs = ${config.allowed_ips}
          Endpoint = ${config.server_endpoint}
          `
        .split("\n")
        .map((line) => line.trim())
        .join("\n");
    }

    function makeClientConfig(
      cfg_base,
      client_private_key,
      interface_address,
      allowed_ips = "0.0.0.0/0, ::/0"
    ) {
      return {
        ...cfg_base,
        client_private_key,
        interface_address,
        allowed_ips,
      };
    }

    function serverConfigTemplate(public_key, address, description) {
      return `configure
        set interfaces wireguard wg0 peer ${public_key} allowed-ips ${address}
        set interfaces wireguard wg0 peer ${public_key} description ${description}
        commit
        save
        exit
      `
        .split("\n")
        .map((line) => line.trim())
        .join("\n");
    }

    function escape_description(text) {
      return text.replaceAll(" ", "-");
    }

    function updateConfigs(clientId) {
      setConfig_sjc(
        clientConfigTemplate(
          makeClientConfig(sjc, privateKey, sjc_subnet(clientId) + "/16", sjc_allowed_ips)
        )
      );

      setConfig_sjc_all_traffic(
        clientConfigTemplate(makeClientConfig(sjc, privateKey, sjc_subnet(clientId) + "/16"))
      );

      setConfig_waw(
        clientConfigTemplate(
          makeClientConfig(waw, privateKey, waw_subnet(clientId) + "/16", waw_allowed_ips)
        )
      );

      setConfig_waw_all_traffic(
        clientConfigTemplate(makeClientConfig(waw, privateKey, waw_subnet(clientId) + "/16"))
      );

      setConfig_sjc_server(
        serverConfigTemplate(
          publicKey,
          sjc_subnet(clientId) + "/32",
          escape_description(description)
        )
      );
      setConfig_waw_server(
        serverConfigTemplate(
          publicKey,
          waw_subnet(clientId) + "/32",
          escape_description(description)
        )
      );
    }

    updateConfigs(clientId);
  }, [clientId, privateKey, publicKey, description]);

  async function getKeys() {
    const res = await fetch("/api/getKeys");
    const data = await res.json();
    setPrivateKey(data.private_key);
    setPublicKey(data.public_key);
  }

  return (
    <>
      <input
        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        type="number"
        min={1}
        max={254}
        step={1}
        value={clientId}
        onChange={(event) => {
          setClientId(+event.target.value);
        }}
      />

      <input
        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        type="text"
        value={privateKey}
        readOnly
      />

      <input
        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        type="text"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <button
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        onClick={getKeys}
      >
        New
      </button>

      <button
        className="px-4 py-2 mx-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        onClick={() => setShowConfig(!showConfig)}
      >
        {showConfig ? "Show QR" : "Show config"}
      </button>

      <br />
      <div className="flex flex-row flex-wrap pt-10 bg-gray-100 justify-evenly">
        <div className="p-10 mb-10 bg-blue-100">
          {showConfig && <pre>{config_sjc}</pre>}
          {!showConfig && <QRCode value={config_sjc} size={256} className="mx-auto" />}
        </div>
        <div className=" p-10 mb-10 bg-blue-200">
          {showConfig && <pre>{config_sjc_all_traffic}</pre>}
          {!showConfig && <QRCode value={config_sjc_all_traffic} size={256} className="mx-auto" />}
        </div>
        <div className=" p-10 mb-10 bg-green-100">
          {showConfig && <pre>{config_waw}</pre>}
          {!showConfig && <QRCode value={config_waw} size={256} className="mx-auto" />}
        </div>
        <div className=" p-10 mb-10 bg-green-200">
          {showConfig && <pre>{config_waw_all_traffic}</pre>}
          {!showConfig && <QRCode value={config_waw_all_traffic} size={256} className="mx-auto" />}
        </div>
      </div>

      <div className="p-8 mb-2 ">
        sjc server
        <pre className="text-white bg-gray-600">{config_sjc_server}</pre>
      </div>

      <div className="p-8 ">
        waw server
        <pre className="text-white bg-gray-600">{config_waw_server}</pre>
      </div>
    </>
  );
}
