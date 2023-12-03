export enum ClientConfigType {
  allTraffic = "All Traffic",
  allTrafficDNS = "All Traffic, DNS",
  allTrafficPiholeDNS = "All Traffic, Pihole DNS",

  localOnly = "Local Only",
  localOnlyDNS = "Local Only, DNS",
  localOnlyPiholeDNS = "Local Only, Pihole DNS",
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
