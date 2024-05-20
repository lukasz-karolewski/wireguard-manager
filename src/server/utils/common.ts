import { Client, Settings, Site } from "@prisma/client";
import crypto from "crypto";
import { ClientConfigType } from "./types";

export function generateCIDR(
  network: string,
  site_id: number,
  device_id: number,
  mask_override?: "24" | "32",
): string {
  const [address, mask] = network.split("/");
  const ipParts = address.split(".", 4) as [string, string, string, string];
  ipParts[2] = site_id.toString(); // Convert id to string before assigning
  ipParts[3] = device_id.toString(); // Convert id to string before assigning

  return `${ipParts.join(".")}/${mask_override ?? mask}`;
}

export function generateWgServerConfig(
  settings: Settings[],
  site: Site,
  otherSites: Site[],
  clients: Client[],
): string {
  const wg_network = settings.find((s) => s.name === "wg_network")!.value;

  if (!site.privateKey) {
    return "There's no private key for this site.";
  }

  const config: string[] = [];

  config.push(
    trimSection([
      `
    # Automatically generated by Wireguard Manager 
    # Site: ${site.name}
    `,
    ]),
  );

  const interfaceSection = [
    `
    [Interface]
    PrivateKey = ${site.privateKey}
    Address = ${assignSiteCIRD(wg_network, site.id)}
    ListenPort = ${site.listenPort}
    `,
  ];
  if (site.postUp) {
    const postUpLines = site.postUp.split("\n").filter((l) => l.trim());
    interfaceSection.push(...postUpLines.map((line) => `PostUp = ${line}`));
  }
  if (site.postDown) {
    const postDownLines = site.postDown.split("\n").filter((l) => l.trim());
    interfaceSection.push(...postDownLines.map((line) => `PostDown = ${line}`));
  }
  config.push(trimSection(interfaceSection));

  otherSites.length &&
    config.push(
      `### site to site Peers
      ${otherSites
        .map((s) => {
          return `[Peer]
                  # site: ${s.name}
                  PublicKey = ${s.publicKey}
                  Endpoint = ${s.endpointAddress}
                  PersistentKeepalive = 3600
                  AllowedIPs = ${[generateCIDR(wg_network, s.id, 0, "24"), s.localAddresses]
                    .filter((v) => v)
                    .join(", ")}
                  `;
        })
        .join("\n")}
      `,
    );

  clients.length &&
    config.push(
      `### Clients
      ${clients
        .map((c) => {
          return `[Peer]
                  # ${c.name}
                  PublicKey = ${c.publicKey}
                  AllowedIPs = ${assignSiteClientCIDR(wg_network, site.id, c.id)}
                  `;
        })
        .join("\n")}
      `,
    );

  return config
    .join("\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

export function generateWgServerConfigCommandsEdgeRouter(
  settings: Settings[],
  site: Site,
  otherSites: Site[],
  clients: Client[],
): string {
  const wg_network = settings.find((s) => s.name === "wg_network")!.value;

  if (!site.privateKey) {
    return "There's no private key for this site.";
  }

  const config: string[] = [];

  const interfaceSection = [
    `
    address ${assignSiteCIRD(wg_network, site.id)}
    listen-port ${site.listenPort}
    mtu 1420
    private-key /config/wireguard/wg.key
    route-allowed-ips true
    `,
  ];
  // if (site.postUp) {
  //   const postUpLines = site.postUp.split("\n").filter((l) => l.trim());
  //   interfaceSection.push(...postUpLines.map((line) => `PostUp = ${line}`));
  // }
  // if (site.postDown) {
  //   const postDownLines = site.postDown.split("\n").filter((l) => l.trim());
  //   interfaceSection.push(...postDownLines.map((line) => `PostDown = ${line}`));
  // }
  config.push(trimSection(interfaceSection));

  otherSites.length &&
    config.push(
      `${otherSites
        .map((s) => {
          return `peer ${s.publicKey} {
                    description ${s.name}      
                    endpoint ${s.endpointAddress}
                     ${[generateCIDR(wg_network, s.id, 0, "24"), s.localAddresses.split(",")]
                       .flat()
                       .filter((v) => v)
                       .map((v) => "allowed-ips " + v)
                       .join("\n ")}
                    }
                  `;
        })
        .join("\n")}
      `,
    );

  clients.length &&
    config.push(
      `${clients
        .map((c) => {
          return `peer ${c.publicKey} {
                  description ${c.name}
                  allowed-ips ${assignSiteClientCIDR(wg_network, site.id, c.id)}
          }`;
        })
        .join("\n")}
      `,
    );

  return config
    .join("\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

export function generateWgServerConfigEdgeRouter(
  settings: Settings[],
  site: Site,
  otherSites: Site[],
  clients: Client[],
): string {
  const wg_network = settings.find((s) => s.name === "wg_network")!.value;

  if (!site.privateKey) {
    return "There's no private key for this site.";
  }

  const config: string[] = [];

  const interfaceSection = [
    `
    configure
    
    set interfaces wireguard wg0 address ${assignSiteCIRD(wg_network, site.id)}
    set interfaces wireguard wg0 private-key /config/wireguard/wg.key
    set interfaces wireguard wg0 route-allowed-ips true
    
    set interfaces wireguard wg0 listen-port ${site.listenPort}
    set interfaces wireguard wg0 mtu 1420
    `,
  ];
  // if (site.postUp) {
  //   const postUpLines = site.postUp.split("\n").filter((l) => l.trim());
  //   interfaceSection.push(...postUpLines.map((line) => `PostUp = ${line}`));
  // }
  // if (site.postDown) {
  //   const postDownLines = site.postDown.split("\n").filter((l) => l.trim());
  //   interfaceSection.push(...postDownLines.map((line) => `PostDown = ${line}`));
  // }
  config.push(trimSection(interfaceSection));

  otherSites.length &&
    config.push(
      `${otherSites
        .map((s) => {
          return `set interfaces wireguard wg0 peer ${s.publicKey} description ${s.name}      
                  set interfaces wireguard wg0 peer ${s.publicKey} endpoint ${s.endpointAddress}
                     ${[generateCIDR(wg_network, s.id, 0, "24"), s.localAddresses.split(",")]
                       .flat()
                       .filter((v) => v)
                       .map(
                         (v) =>
                           `set interfaces wireguard wg0 peer ${s.publicKey} allowed-ips ${v}`,
                       )
                       .join("\n ")}
                    
                  `;
        })
        .join("\n")}
      `,
    );

  clients.length &&
    config.push(
      `${clients
        .map((c) => {
          return `set interfaces wireguard wg0 peer ${c.publicKey} description ${c.name}
                  set interfaces wireguard wg0 peer ${c.publicKey} allowed-ips ${assignSiteClientCIDR(wg_network, site.id, c.id)}
          `;
        })
        .join("\n")}
      `,
    );

  config.push("commit");
  config.push("save");
  config.push("exit");

  return config
    .join("\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

function trimSection(section: string[]) {
  return section
    .map((chunk) =>
      chunk
        .split("\n")
        .filter((l) => l.trim())
        .map((l) => l.trim())
        .join("\n"),
    )
    .join("\n");
}

function assignSiteCIRD(wg_network: string, site_id: number) {
  // keeping it at /16, but maybe it's sufficient if this is /24?
  return generateCIDR(wg_network, site_id, 1);
}

function assignSiteClientCIDR(wg_network: string, site_id: number, client_id: number) {
  // allow only traffic coming directly from the client
  // adding 1, because autoincrement starts at 1, which is the site itself
  return generateCIDR(wg_network, site_id, client_id + 1, "32");
}

function assignClientCIDR(wg_network: string, site_id: number, client_id: number) {
  // client can talk to all other clients in the wg_network
  // adding 1, because autoincrement starts at 1, which is the site itself
  return generateCIDR(wg_network, site_id, client_id + 1);
}

export function generateClientConfig(
  settings: Settings[],
  site: Site,
  client: Client,
  type: ClientConfigType,
) {
  const wg_network = settings.find((s) => s.name === "wg_network")!.value;

  let DNS = "";
  if (type === ClientConfigType.localOnlyDNS || type === ClientConfigType.allTrafficDNS) {
    DNS = site.DNS ?? "";
  } else if (
    type === ClientConfigType.localOnlyPiholeDNS ||
    type === ClientConfigType.allTrafficPiholeDNS
  ) {
    DNS = site.piholeDNS ?? "";
  }

  let config = `
    [Interface]
    Address = ${assignClientCIDR(wg_network, site.id, client.id)}
    PrivateKey = ${client.privateKey}
    ${DNS ? `DNS = ${DNS}` : ""}

    [Peer]
    Endpoint = ${site.endpointAddress}
    PublicKey = ${site.publicKey}
    AllowedIPs = ${
      type == ClientConfigType.localOnly ||
      type == ClientConfigType.localOnlyDNS ||
      type == ClientConfigType.localOnlyPiholeDNS
        ? [generateCIDR(wg_network, 0, 0), site.localAddresses].filter((v) => v).join(", ")
        : "0.0.0.0/0, ::/0"
    }
    `;

  config = config.replace(/^\s+/gm, ""); // Remove leading whitespace
  return config;
}

export function compute_hash(str: string) {
  return crypto.createHash("sha256").update(str).digest("hex");
}
