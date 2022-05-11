import { QRCodeSVG } from "qrcode.react";
import React, { FC, useEffect, useState } from "react";
import { Button, Layout } from "~/components/ui";
import { ServerConfig } from "~/model/server";
import { ClientConfig, makeClientConfig } from "~/model/client";
import { getNewKeyPair, getServers } from "~/utils/client";



type ClientConfigProps = {
  config: ClientConfig;
  show: "config" | "qr";
};

const ClientConfig: FC<React.PropsWithChildren<ClientConfigProps>> = ({ config, show }) => {
  function clientConfigTemplate(config: ClientConfig) {
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

  return (
    <div className="bg-gray-100 justify-evenly mb-2 last:mb-0  overflow-auto">
      <div className="p-2  bg-blue-100  overflow-auto">
        {show == "config" && <pre>{clientConfigTemplate(config)}</pre>}
        {show == "qr" && (
          <div className="grid grid-cols-2">
            <div className="mx-auto">
              <QRCodeSVG value={clientConfigTemplate(config)} size={256} />
            </div>
            <ul>
              <li>Name {config.nickname}</li>
              <li>IP Allocation {config.interface_address}</li>
              <li>Allowed ips {config.allowed_ips}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

type ServerConfigProps = {
  config: ServerConfig;
  clients: ClientConfig[];
};

const ServerConfigView: FC<React.PropsWithChildren<ServerConfigProps>> = ({ config, clients }) => {
  function serverConfigToEdgerouterCommandLine(config: ServerConfig) {
    return `configure
      set interfaces wireguard wg0 peer ${config.server_public_key} allowed-ips ${config.server_address}
      set interfaces wireguard wg0 peer ${config.server_public_key} description ${config.name}
      commit
      save
      exit
    `
      .split("\n")
      .map((l) => l.trim())
      .join("\n");
  }

  function serverConfigToNativeWireguard(config: ServerConfig) {
    const header = `[Interface]
    Address = ${config.server_address}
    ListenPort = ${config.server_port}
    PrivateKey = ${config.server_private_key}
    MTU = ${config.server_mtu}
    `;

    const clientSection = clients?.map((c) => {
      return `\n [Peer] \n PublicKey = ${c.client_public_key}
                AllowedIPs = ${c.allowed_ips}
                Endpoint = ${c.server_endpoint}\n`;
    });

    return (header + clientSection)
      .split("\n")
      .map((l) => l.trim())
      .join("\n");
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(printConfig(config));
  }

  function printConfig(config: ServerConfig) {
    switch (config.mode) {
      case "native":
        return serverConfigToNativeWireguard(config);
      case "edgerouter":
        return serverConfigToEdgerouterCommandLine(config);
    }
  }

  return (
    <div className="p-8 ">
      <h3>{config.name} server</h3> <button onClick={copyToClipboard}>copy</button>
      <pre className="text-white bg-gray-600 p-2 overflow-auto">{printConfig(config)}</pre>
    </div>
  );
};

// function NewClient() {
//   const [clientId, setClientId] = useState(1);
//   const [privateKey, setPrivateKey] = useState("");
//   const [publicKey, setPublicKey] = useState("");
//   const [description, setDescription] = useState("");

//   return (
//     <>
//       <input
//         className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//         type="number"
//         min={1}
//         max={254}
//         step={1}
//         value={clientId}
//         onChange={(event) => {
//           setClientId(+event.target.value);
//         }}
//       />

//       <input
//         className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//         type="text"
//         value={privateKey}
//         readOnly
//       />

//       <input
//         className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//         type="text"
//         value={description}
//         onChange={(event) => setDescription(event.target.value)}
//       />
//     </>
//   );
// }

// function NewServer() {
//   return <></>;
// }

export default function Home() {
  const [showConfig, setShowConfig] = useState(false);

  let i = 1;
  const [servers, setServers] = useState<ServerConfig[]>([]);
  const [clients, setClients] = useState<ClientConfig[]>([]);

  useEffect(() => {
    getServers().then((d) => {
      console.log(d);
      setServers(d);
    });
  });

  async function newClient() {
    const clientId = i++;
    const nickname = "test";
    const keyPair = await getNewKeyPair();

    let newClients: ClientConfig[] = [];

    servers.forEach((server) =>
      newClients.push(
        makeClientConfig(nickname, server, clientId, keyPair.private_key, keyPair.public_key)
      )
    );
    setClients((c) => [...c, ...newClients]);
  }

  return (
    <Layout>
      <Button onClick={newClient}>New Client</Button>

      <Button onClick={() => setShowConfig(!showConfig)}>
        {showConfig ? "Show QR" : "Show config"}
      </Button>

      {clients.map((c) => (
        <ClientConfig key={c.client_public_key} config={c} show={showConfig ? "config" : "qr"} />
      ))}

    </Layout>
  );
}
