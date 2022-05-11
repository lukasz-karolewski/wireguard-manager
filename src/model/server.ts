export type ServerConfig = {
  name?: string;

  server_address: string;
  server_port: number;
  server_private_key: string;
  server_public_key: string;
  server_mtu: number;

  mode: "native" | "edgerouter";

  dns: string;
  subnet: string;
  allowed_ips: string;
  server_endpoint: string;
};

export const sjc: ServerConfig = {
  name: "sjc",

  server_address: "172.16.1.1/16, fd41:da2c:5ecb:b9a7::1/48",
  server_port: 51820,
  server_private_key: "/config/wireguard/wg.key",
  server_public_key: "BEGg/cVw0trQmwZvbaf+0JZ1KJkQxnZYlQQSNrx9kGM=",
  server_mtu: 1450, //1420

  mode: "native",

  subnet: "172.16.1.*/16",
  dns: "192.168.11.1",
  allowed_ips: "192.168.11.0/24",
  server_endpoint: "edgerouter-sjc.duckdns.org:51820",
};

export const waw: ServerConfig = {
  name: "waw-targowek",

  server_address: "172.16.2.1/16",
  server_port: 51820,
  server_private_key: "/config/wireguard/wg.key",
  server_public_key: "JS9jXHlQjx/Vl0nYM6qnPIUI/B/EFNq7DzNKb78ctz8=",
  server_mtu: 1450, //1420

  mode: "edgerouter",

  subnet: "172.16.2.*/16",
  dns: "192.168.21.1",
  allowed_ips: "192.168.20.0/24, 192.168.21.0/24",
  server_endpoint: "edgerouter-waw.duckdns.org:51820",
};

export const waw_wola: ServerConfig = {
  name: "waw-wola",

  server_address: "172.16.3.1/16",
  server_port: 51820,
  server_private_key: "/config/wireguard/wg.key",
  server_public_key: "test",
  server_mtu: 1450,

  mode: "native",

  subnet: "172.16.3.*/16",
  dns: "192.168.31.1",
  allowed_ips: "192.168.31.0/24",
  server_endpoint: "rkarolew.duckdns.org:51820",
};
