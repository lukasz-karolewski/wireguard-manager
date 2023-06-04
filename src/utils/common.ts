import { ClientConfig, ServerConfig, GlobalConfig } from "~/types";

export function escape_description(text: string) {
  return text.replaceAll(" ", "-");
}

export const server_subnet_to_address = (subnet: string, id: number) =>
  subnet.replace("*", "" + id);


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

  const siteToSiteSection = config.servers?.filter((s) => s.name != serverName).map((s) => {
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
              PublicKey = ${c.for_server.PublicKey}
              AllowedIPs = ${c.for_server.AllowedIPs}
              Endpoint = ${c.for_server.Endpoint}
              \n`;
  });

  return (interfaceSection + siteToSiteSection + clientsSection)
    .split("\n")
    .map((l) => l.trim())
    .join("\n");
}

export function clientConfigTemplate(server: ServerConfig, client: ClientConfig, configType: "localOnly" | "allTraffic") {
  return `[Interface]
        Address = ${client.for_client.Address}
        PrivateKey = ${client.for_client.PrivateKey}
        DNS = ${client.for_client.DNS}

        [Peer]
        PublicKey = ${server.for_client.PublicKey}
        AllowedIPs = ${configType == "localOnly" ? server.for_client.AllowedIPs : "0.0.0.0/0 , ::/0"}
        Endpoint = ${server.for_client.Endpoint}
      `
    .split("\n")
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
      return "" //serverConfigToEdgerouterCommandLine(config, clients);
  }
}