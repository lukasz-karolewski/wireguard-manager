import { unstable_noStore as noStore } from "next/cache";
import { WireGuard } from "~/app/lib/types";
import { execShellCommand } from "~/app/lib/utils/execShellCommand";
export async function getAllClients(
  filename = "/etc/wireguard/wg0.conf",
): Promise<WireGuard.Peer[]> {
  const wgConfig = await execShellCommand(`cat ${filename}`);

  const clients = wgConfig.split(/\n(?=\[Peer\])/).map((clientConfig) => {
    const client = clientConfig.split("\n");
    const clientObject: WireGuard.Peer = {
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
