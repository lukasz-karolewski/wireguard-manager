import { Client, Settings, Site } from "@prisma/client";
import { ClientConfigType } from "./types";

function generateAddress(
  network: string,
  site_id: number,
  device_id: number,
  mask_to_set?: string,
): string {
  const [address, mask] = network.split("/");
  const ipParts = address.split(".", 4) as [string, string, string, string];
  ipParts[2] = site_id.toString(); // Convert id to string before assigning
  ipParts[3] = device_id.toString(); // Convert id to string before assigning

  return `${ipParts.join(".")}/${mask_to_set ?? mask}`;
}

export function serverConfigToNativeWireguard(
  settings: Settings[],
  site: Site,
  otherSites: Site[],
  clients: Client[],
): string {
  const wg_network = settings.find((s) => s.name === "wg_network")!.value;

  const interface_section = `
    [Interface]
    Address = ${generateAddress(wg_network, site.id, 1)}
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
                AllowedIPs = ${[generateAddress(wg_network, s.id, 0, "24"), s.localAddresses].join(
                  ", ",
                )}
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
                AllowedIPs = ${generateAddress(wg_network, site.id, c.id, "32")}
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
    Address = ${generateAddress(wg_network, site.id, client.id, "16")}
    PrivateKey = ${client.PrivateKey}
    ${DNS ? `DNS = ${DNS}` : ""}

    [Peer]
    Endpoint = ${site.endpointAddress}
    PublicKey = ${site.PublicKey}
    AllowedIPs = ${
      type == ClientConfigType.localOnly || type == ClientConfigType.localOnlyDNS
        ? [generateAddress(wg_network, 0, 0), site.localAddresses].join(", ")
        : "0.0.0.0/0, ::/0"
    }
    `;

  config = config.replace(/^\s+/gm, ""); // Remove leading whitespace
  return config;
}
