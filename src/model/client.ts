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
