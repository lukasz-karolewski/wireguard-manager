export enum SiteType {
  NATIVE = "native",
  EDGEROUTER = "edgerouter",
}

export enum ActionType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}

export enum ClientConfigType {
  allTraffic = "allTraffic",
  allTrafficDNS = "allTrafficDNS",
  allTrafficPiholeDNS = "allTrafficPiholeDNS",

  localOnly = "localOnly",
  localOnlyDNS = "localOnlyDNS",
  localOnlyPiholeDNS = "localOnlyPiholeDNS",
}

export function clientConfigToString(type: ClientConfigType): string {
  switch (type) {
    case ClientConfigType.allTraffic:
      return "redirect all";
    case ClientConfigType.allTrafficDNS:
      return "redirect all, dns";
    case ClientConfigType.allTrafficPiholeDNS:
      return "redirect all, pihole";
    case ClientConfigType.localOnly:
      return "local only";
    case ClientConfigType.localOnlyDNS:
      return "local only, dns";
    case ClientConfigType.localOnlyPiholeDNS:
      return "local only, pihole";
  }
}
