import { ClientConfig, ServerConfig, GlobalConfig, ClientConfigType } from "~/types";

export const configTypes: ClientConfigType[] = ["allTraffic", "localOnlyDNS", "localOnly"];

export const get_new_site_address = (config: GlobalConfig) => {
  const id = config.servers.length + 1;
  return get_server_address(config.wg_network, id);
};

export const get_server_address = (subnet: string, network_number: number) =>
  subnet
    .split(".")
    .slice(0, 2)
    .concat([`${network_number}`, `1/16`])
    .join(".");

export const client_address_for_server = (server: ServerConfig, id: number) =>
  server.for_server.Address.split(".")
    .slice(0, 3)
    .concat([`${id}/16`])
    .join(".");

export function clientConfigTemplate(
  server: ServerConfig,
  client: ClientConfig,
  configType: ClientConfigType,
) {
  return [
    `[Interface]`,
    `Address = ${client_address_for_server(server, client.id)}`,
    `PrivateKey = ${client.PrivateKey}`,
    configType == "allTraffic" || configType == "localOnlyDNS"
      ? `DNS = ${server.for_server.DNS}`
      : "",

    `[Peer]`,
    `PublicKey = ${server.for_client.PublicKey}`,
    `AllowedIPs = ${
      configType == "localOnly" ? server.for_client.AllowedIPs : "0.0.0.0/0 , ::/0"
    }`,
    `Endpoint = ${server.for_client.Endpoint}`,
  ]
    .map((line) => line.trim())
    .join("\n");
}

export function printServerConfig(config: GlobalConfig, serverConfig: ServerConfig) {
  switch (serverConfig.mode) {
    case "native":
      return serverConfigToNativeWireguard(config, serverConfig);
    case "edgerouter":
      return serverConfigToEdgerouterCommandLine(config, serverConfig);
  }
}

export function serverConfigToNativeWireguard(config: GlobalConfig, serverConfig: ServerConfig) {
  const interfaceSection = `[Interface]
      Address = ${serverConfig.for_server.Address}
      ListenPort = ${serverConfig.for_server.ListenPort}
      PrivateKey = ${serverConfig.for_server.PrivateKey}
      MTU = ${serverConfig.for_server.MTU}
      `;

  const siteToSiteSection = config.servers
    ?.filter((s) => s.name != serverConfig.name)
    .map((s) => {
      return `[Peer] 
              # ${s.name}
              PublicKey = ${s.for_client.PublicKey}
              AllowedIPs = ${s.for_client.AllowedIPs}
              Endpoint = ${s.for_client.Endpoint}
              \n`;
    })
    .join("\n");

  const clientsSection = config.clients
    ?.map((c) => {
      return `[Peer] 
            # ${c.name}
            PublicKey = ${c.PublicKey}
            AllowedIPs = ${client_address_for_server(serverConfig, c.id)}
            \n`;
    })
    .join("\n");

  return (
    interfaceSection +
    "\n### site to site Peers \n" +
    siteToSiteSection +
    "### Clients \n" +
    clientsSection
  )
    .split("\n")
    .map((l, i, arr) => {
      // compact multiple empty lines into one, and trims each line
      if (l.trim() === "" && arr[i - 1]?.trim() === "") {
        return null;
      }
      return l.trim();
    })
    .filter((l) => l !== null)
    .join("\n");
}

export function serverConfigToEdgerouterCommandLine(
  config: GlobalConfig,
  serverConfig: ServerConfig,
) {
  return `configure
          commit
          save
          exit`
    .split("\n")
    .map((l, i, arr) => {
      // compact multiple empty lines into one, and trims each line
      if (l.trim() === "" && arr[i - 1]?.trim() === "") {
        return null;
      }
      return l.trim();
    })
    .filter((l) => l !== null)
    .join("\n");
}
