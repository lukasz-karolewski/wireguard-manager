export const clientConfigTypes = ["allTraffic", "localOnlyDNS", "localOnly"] as const;

export interface WgInterface {
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

export interface WgPeer {
  PublicKey: string;
  AllowedIPs: string;
  Endpoint: string;
}
