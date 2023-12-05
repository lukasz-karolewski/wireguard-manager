export enum ClientConfigType {
  allTraffic = "allTraffic",
  allTrafficDNS = "allTrafficDNS",
  allTrafficPiholeDNS = "allTrafficPiholeDNS",

  localOnly = "localOnly",
  localOnlyDNS = "localOnlyDNS",
  localOnlyPiholeDNS = "localOnlyPiholeDNS",
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
