import { unstable_noStore as noStore } from "next/cache";
import { execShellCommand } from "~/server/utils/execShellCommand";
import { WgPeer } from "./types";

export async function getAllClients(filename = "/etc/wireguard/wg0.conf"): Promise<WgPeer[]> {
  const wgConfig = await execShellCommand(`cat ${filename}`);

  const clients = wgConfig.split(/\n(?=\[Peer\])/).map((clientConfig) => {
    const client = clientConfig.split("\n");
    const clientObject: WgPeer = {
      //   name: getComment(client),
      //   PrivateKey: getAttr(client, "PrivateKey"),
      PublicKey: getAttr(client, "PublicKey"),
      AllowedIPs: getAttr(client, "AllowedIPs"),
      Endpoint: getAttr(client, "Endpoint"),
      //   PersistentKeepalive: getAttr(client, "PersistentKeepalive"),
    };
    return clientObject;
  });

  noStore();
  return clients;
}

function getComment(client: string[]): string {
  return (
    client
      .find((line) => line.match(/^#\s*[^#\n]+$/))
      ?.replace("#", "")
      .trim() ?? ""
  );
}

function getAttr(client: string[], attrName: string): string {
  return client.find((line) => line.match(new RegExp(`^${attrName}`)))?.split("=")[1] ?? "";
}
