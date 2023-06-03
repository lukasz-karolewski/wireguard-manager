export type GlobalConfig = {
    local_site: ServerConfig,
    remote_sites: ServerConfig[],
    clients: ClientConfig[],
};

export type ServerConfig = {
    name: string;
    mode: "native" | "edgerouter";

    for_server: WireGuard.Interface;
    for_client: WireGuard.Peer;
};

export type ClientConfig = {
    name: string;

    for_server: WireGuard.Peer;
    for_client: WireGuard.Interface;
};


namespace WireGuard {
    interface Interface {
        Address: string;
        ListenPort: number;
        MTU?: number;
        Table?: number;

        PrivateKey: string;

        PreUp?: string[];
        PreDown?: string[];
        PostUp?: string[];
        PostDown?: string[];
    }

    export type Peer = {
        PublicKey: string;
        AllowedIPs: string;
        Endpoint: string;
        PersistentKeepalive: string;
    };
}

export type GetKeysResponse = {
    private_key: string;
    public_key: string;
};

