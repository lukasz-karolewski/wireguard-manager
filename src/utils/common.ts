import { ClientConfig, ServerConfig } from "~/types";

export function escape_description(text: string) {
  return text.replaceAll(" ", "-");
}

export const server_subnet_to_address = (subnet: string, id: number) =>
  subnet.replace("*", "" + id);

export function makeClientConfig(
  nickname: string,
  server_config: ServerConfig,
  clientId: number,
  client_private_key: string,
  client_public_key: string
): ClientConfig {
  return {
    name: nickname,
    interface_address: server_subnet_to_address(server_config.subnet, clientId),
    client_private_key,
    client_public_key,
    dns: server_config.dns,
    server_public_key: server_config.server_public_key,
    allowed_ips: server_config.allowed_ips,
    server_endpoint: server_config.server_endpoint,
  };
}

export function clientConfigTemplate(config: ClientConfig) {
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

export function serverConfigToNativeWireguard(config: ServerConfig, clients: ClientConfig[]) {
  const header = `[Interface]
    Address = ${config.server_address}
    ListenPort = ${config.server_port}
    PrivateKey = ${config.server_private_key}
    MTU = ${config.server_mtu}
    `;

  const clientSection = clients?.map((c) => {
    return `\n 
            [Peer] 
            # ${c.name}
            PublicKey = ${c.client_public_key}
            AllowedIPs = ${c.allowed_ips}
            Endpoint = ${c.server_endpoint}
            \n`;
  });

  return (header + clientSection)
    .split("\n")
    .map((l) => l.trim())
    .join("\n");
}


export function serverConfigToEdgerouterCommandLine(config: ServerConfig, clients: ClientConfig[]) {
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

export function printConfig(config: ServerConfig, clients: ClientConfig[]) {
  switch (config.mode) {
    case "native":
      return serverConfigToNativeWireguard(config, clients);
    case "edgerouter":
      return serverConfigToEdgerouterCommandLine(config, clients);
  }
}