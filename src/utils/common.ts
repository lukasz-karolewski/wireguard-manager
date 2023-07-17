import { ClientConfig, ServerConfig, GlobalConfig } from "~/types";

export function escape_description(text: string) {
  return text.replaceAll(" ", "-");
}

export const get_new_site_address = (config: GlobalConfig) => {
  const id = config.servers.length + 1;

  return get_server_address(config.wg_network, id);
};

export const get_server_address = (subnet: string, network_number: number) =>
  subnet.split(".").slice(0, 2).concat([`${network_number}`, `1/16`]).join(".");

export const get_new_client_address = (config: GlobalConfig) => {
  const id = config.clients.length + 1;
};

export const client_address_for_server = (server: ServerConfig, id: number) => 
  server.for_server.Address.split(".").slice(0, 3).concat([`${id}/16`]).join(".");  

export function serverConfigToNativeWireguard(config: GlobalConfig, serverName: string) {
  const serverConfig = config.servers.find((s) => s.name === serverName);
  if (!serverConfig) {
    throw new Error(`Server ${serverName} not found`);
  }

  const interfaceSection = `[Interface]
      Address = ${serverConfig.for_server.Address}
      ListenPort = ${serverConfig.for_server.ListenPort}
      PrivateKey = ${serverConfig.for_server.PrivateKey}
      MTU = ${serverConfig.for_server.MTU}
      `;

  const siteToSiteSection = config.servers
    ?.filter((s) => s.name != serverName)
    .map((s) => {
      return `\n 
              [Peer] 
              # ${s.name}
              PublicKey = ${s.for_client.PublicKey}
              AllowedIPs = ${s.for_client.AllowedIPs}
              Endpoint = ${s.for_client.Endpoint}
              \n`;
    });

  const clientsSection = config.clients?.map((c) => {
    return `\n 
              [Peer] 
              # ${c.name}
              PublicKey = ${c.PublicKey}
              AllowedIPs = ${serverConfig.for_server.Address} ${c.id}
              \n`;
  });

  return (interfaceSection + siteToSiteSection + clientsSection)
    .split("\n")
    .map((l) => l.trim())
    .join("\n");
}

export function clientConfigTemplate(
  server: ServerConfig,
  client: ClientConfig,
  configType: "localOnly" | "allTraffic"
) {
  return [`[Interface]`,
        `Address = ${client_address_for_server(server, client.id)}`,
        `PrivateKey = ${client.PrivateKey}`,
        server.for_server.DNS ? `DNS = ${server.for_server.DNS}` : '',

        `[Peer]`,
        `PublicKey = ${server.for_client.PublicKey}`,
        `AllowedIPs = ${
          configType == "localOnly" ? server.for_client.AllowedIPs : "0.0.0.0/0 , ::/0"
        }`,
        `Endpoint = ${server.for_client.Endpoint}`
  ]
    .map((line) => line.trim())
    .join("\n");
}

// export function serverConfigToEdgerouterCommandLine(config: GlobalConfig, serverName: string) {

//   const serverConfig = config.servers.find((s) => s.name === serverName);
//   if (!serverConfig) {
//     throw new Error(`Server ${serverName} not found`);
//   }

//   return `configure
//     set interfaces wireguard wg0 peer ${serverConfig.for_server.} allowed - ips ${config.server_address}
//     set interfaces wireguard wg0 peer ${config.server_public_key} description ${config.name}
//   commit
//   save
//   exit
//     `
//     .split("\n")
//     .map((l) => l.trim())
//     .join("\n");
// }

export function printConfig(config: GlobalConfig, serverName: string) {
  const serverConfig = config.servers.find((s) => s.name === serverName);
  if (!serverConfig) {
    throw new Error(`Server ${serverName} not found`);
  }

  switch (serverConfig.mode) {
    case "native":
      return serverConfigToNativeWireguard(config, serverName);
    case "edgerouter":
      return ""; //serverConfigToEdgerouterCommandLine(config, clients);
  }
}
