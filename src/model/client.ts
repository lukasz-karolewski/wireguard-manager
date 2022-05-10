import { server_subnet_to_address } from "~/utils/common";
import { ServerConfig } from "./server";

export type ClientConfig = {
  nickname: string;

  interface_address: string;
  client_private_key: string;
  client_public_key: string;
  dns: string;

  server_public_key: string;
  allowed_ips: string;
  server_endpoint: string;
};


export function makeClientConfig(
  nickname: string,
  server_config: ServerConfig,
  clientId: number,
  client_private_key: string,
  client_public_key: string
): ClientConfig {
  return {
    nickname,
    interface_address: server_subnet_to_address(server_config.subnet, clientId),
    client_private_key,
    client_public_key,
    dns: server_config.dns,
    server_public_key: server_config.server_public_key,
    allowed_ips: server_config.allowed_ips,
    server_endpoint: server_config.server_endpoint,
  };
}