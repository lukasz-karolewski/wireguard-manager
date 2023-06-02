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