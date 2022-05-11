import React, { FC, useEffect, useState } from "react";
import { Button, Layout } from "~/components/ui";
import { ServerConfig } from "~/model/server";
import { ClientConfig, makeClientConfig } from "~/model/client";
import { getNewKeyPair, getServers } from "~/utils/client";

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


// function NewServer() {
//   return <></>;
// }

export default function Home() {
  const [servers, setServers] = useState<ServerConfig[]>([]);

  useEffect(() => {
    getServers().then((d) => {
      setServers(d);
    });
  });

  function addServer() {

  }

  return (
    <Layout>
      <Button onClick={addServer}>Add Server</Button>

      {servers.map((s) => (
        <ServerConfigView config={s} clients={[]}></ServerConfigView>
      ))}
    </Layout>
  );
}
