export type GetKeysResponse = {
    private_key: string;
    public_key: string;
};

export type ClientObject = {
    name: string;
    privateKey: string;
    publicKey: string;
    allowedIPs: string;
    endpoint: string;
    persistentKeepalive: string;
};

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

export type ClientConfig = {
    name: string;

    interface_address: string;
    client_private_key: string;
    client_public_key: string;
    dns: string;

    server_public_key: string;
    allowed_ips: string;
    server_endpoint: string;
};