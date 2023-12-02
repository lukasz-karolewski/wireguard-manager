export enum ClientConfigType {
  allTraffic = "allTraffic",
  localOnlyDNS = "localOnlyDNS",
  localOnly = "localOnly",
}

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
