import { Client, Settings, Site } from "@prisma/client";
import { ClientConfigType } from "./types";

export function serverConfigToNativeWireguard(
  settings: Settings[],
  site: Site,
  otherSites: Site[],
  clients: Client[],
): string {
  const wg_network = settings.find((s) => s.name === "wg_network")!.value;

  const interface_section = `
    [Interface]
    Address = ${generateAddress(wg_network, site.id)}
    ListenPort = 51820
    PrivateKey = ${site.PrivateKey}
    # MTU = 1420 - default
    `.trim();

  const peers_section = `
    ### site to site Peers
    ${otherSites
      .map((s) => {
        return `[Peer]
                # ${s.name}
                PublicKey = ${s.PublicKey}
                Endpoint = ${s.endpointAddress}
                AllowedIPs = ${s.localAddresses}
                `;
      })
      .join("\n")}
      `.trim();

  const client_section = clients.length
    ? ` 
    ### Clients
    ${clients
      .map((c) => {
        return `[Peer]
                # ${c.name}
                PublicKey = ${c.PublicKey}
                AllowedIPs = ${generateAddress(wg_network, c.id)}
                `;
      })
      .join("\n")}
    `.trim()
    : "";

  let config = [interface_section, peers_section, client_section].join("\n\n");

  config = config
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  return config;
}

export function clientConfigToNativeWireguard(
  settings: Settings[],
  site: Site,
  client: Client,
  type: ClientConfigType,
) {
  const wg_network = settings.find((s) => s.name === "wg_network")!.value;
  const DNS = type == ClientConfigType.localOnlyDNS ? site.DSN : "";

  let config = `
    [Interface]
    Address = ${generateAddress(wg_network, client.id)}
    PrivateKey = ${client.PrivateKey}
    ${DNS ? `DNS = ${DNS}` : ""}

    [Peer]
    Endpoint = ${site.endpointAddress}
    PublicKey = ${site.PublicKey}
    AllowedIPs = ${
      type == ClientConfigType.localOnly || type == ClientConfigType.localOnlyDNS
        ? site.localAddresses
        : "0.0.0.0/0, ::/0"
    }
    `;

  config = config.replace(/^\s+/gm, ""); // Remove leading whitespace
  return config;
}

function generateAddress(wg_network: string, id: number): string {
  const [address, mask] = wg_network.split("/");
  const ipParts = address.split(".", 4) as [string, string, string, string];
  ipParts[3] = id.toString(); // Convert id to string before assigning

  return `${ipParts.join(".")}/${mask}`;
}

// export const get_new_site_address = (config: GlobalConfig) => {
//   const id = config.servers.length + 1;
//   return get_server_address(config.wg_network, id);
// };

// export const get_server_address = (subnet: string, network_number: number) =>
//   subnet
//     .split(".")
//     .slice(0, 2)
//     .concat([`${network_number}`, `1/16`])
//     .join(".");

// export const client_address_for_server = (server: ServerConfig, id: number) =>
//   server.for_server.Address.split(".")
//     .slice(0, 3)
//     .concat([`${id}/16`])
//     .join(".");

// export function clientConfigTemplate(
//   server: ServerConfig,
//   client: ClientConfig,
//   configType: ClientConfigType,
// ) {
//   return [
//     `[Interface]`,
//     `Address = ${client_address_for_server(server, client.id)}`,
//     `PrivateKey = ${client.PrivateKey}`,
//     configType == "allTraffic" || configType == "localOnlyDNS"
//       ? `DNS = ${server.for_server.DNS}`
//       : "",

//     `[Peer]`,
//     `PublicKey = ${server.for_client.PublicKey}`,
//     `AllowedIPs = ${
//       configType == "localOnly" || configType == "localOnlyDNS"
//         ? server.for_client.AllowedIPs
//         : "0.0.0.0/0 , ::/0"
//     }`,
//     `Endpoint = ${server.for_client.Endpoint}`,
//   ]
//     .map((line) => line.trim())
//     .join("\n");
// }

// export function printServerConfig(config: GlobalConfig, serverConfig: ServerConfig) {
//   switch (serverConfig.mode) {
//     case "native":
//       return serverConfigToNativeWireguard(config, serverConfig);
//     case "edgerouter":
//       return serverConfigToEdgerouterCommandLine(config, serverConfig);
//   }
// }

// export function serverConfigToNativeWireguard_old(
//   config: GlobalConfig,
//   serverConfig: ServerConfig,
// ) {
//   const interfaceSection = `[Interface]
//       Address = ${serverConfig.for_server.Address}
//       ListenPort = ${serverConfig.for_server.ListenPort}
//       PrivateKey = ${serverConfig.for_server.PrivateKey}
//       MTU = ${serverConfig.for_server.MTU}
//       `;

//   const siteToSiteSection = config.servers
//     ?.filter((s) => s.name != serverConfig.name)
//     .map((s) => {
//       return `[Peer]
//               # ${s.name}
//               PublicKey = ${s.for_client.PublicKey}
//               AllowedIPs = ${s.for_client.AllowedIPs}
//               Endpoint = ${s.for_client.Endpoint}
//               \n`;
//     })
//     .join("\n");

//   const clientsSection = config.clients
//     ?.map((c) => {
//       return `[Peer]
//             # ${c.name}
//             PublicKey = ${c.PublicKey}
//             AllowedIPs = ${client_address_for_server(serverConfig, c.id)}
//             \n`;
//     })
//     .join("\n");

//   return (
//     interfaceSection +
//     "\n### site to site Peers \n" +
//     siteToSiteSection +
//     "### Clients \n" +
//     clientsSection
//   )
//     .split("\n")
//     .map((l, i, arr) => {
//       // compact multiple empty lines into one, and trims each line
//       if (l.trim() === "" && arr[i - 1]?.trim() === "") {
//         return null;
//       }
//       return l.trim();
//     })
//     .filter((l) => l !== null)
//     .join("\n");
// }

// export function serverConfigToEdgerouterCommandLine(
//   config: GlobalConfig,
//   serverConfig: ServerConfig,
// ) {
//   return `configure
//           commit
//           save
//           exit`
//     .split("\n")
//     .map((l, i, arr) => {
//       // compact multiple empty lines into one, and trims each line
//       if (l.trim() === "" && arr[i - 1]?.trim() === "") {
//         return null;
//       }
//       return l.trim();
//     })
//     .filter((l) => l !== null)
//     .join("\n");
// }
