import { QRCodeSVG } from "qrcode.react";
import React, { FC, useEffect, useState } from "react";
import { Button, Layout } from "~/components/ui";
import { ServerConfig } from "~/model/server";
import { ClientConfig, makeClientConfig } from "~/model/client";
import { getNewKeyPair, getServers } from "~/utils/client";

type ServerConfigProps = {
  config: ServerConfig;
};

const ServerConfigView: FC<React.PropsWithChildren<ServerConfigProps>> = ({ config }) => {
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
  const [showConfig, setShowConfig] = useState(true);

  let i = 1;
  const [servers, setServers] = useState<ServerConfig[]>([]);

  useEffect(() => {
    getServers().then((d) => {
      setServers(d);
    });
  });

  async function newServer() {
    const clientId = i++;
    const nickname = "test";
    const keyPair = await getNewKeyPair();

    let newClients: ClientConfig[] = [];

    servers.forEach((server) =>
      newClients.push(
        makeClientConfig(nickname, server, clientId, keyPair.private_key, keyPair.public_key)
      )
    );
  }

  return (
    <Layout>
      <Button onClick={newServer}>Add Server</Button>

      <Button onClick={() => setShowConfig(!showConfig)}>
        {showConfig ? "Show QR" : "Show config"}
      </Button>

      {servers.map((s) => (
        <ServerConfigView config={s}></ServerConfigView>
      ))}
    </Layout>
  );
}
