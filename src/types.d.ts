export type GlobalConfig = {
    wg_network: string;

    servers: ServerConfig[],
    clients: ClientConfig[],
};

export type ServerConfig = {
    name: string;
    mode: "native" | "edgerouter";
    deployment: "file" | "scp" | "ssh";
    deployment_target: string;

    for_server: WireGuard.Interface;
    for_client: WireGuard.Peer;
};

export type ClientConfig = {
    name: string;
    mode: "localOnly" | "allTraffic";

    for_server: WireGuard.Peer;
    for_client: WireGuard.Interface;
};


namespace WireGuard {
    interface Interface {
        Address: string;
        ListenPort: number;
        MTU?: number;
        DNS?: string;

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
    };
}

export type GetKeysResponse = {
    private_key: string;
    public_key: string;
};

