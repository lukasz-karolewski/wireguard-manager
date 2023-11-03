import { NextApiRequest, NextApiResponse } from "next";
import { WireGuard } from "~/app/lib/types";
import { execShellCommand } from "~/app/lib/utils/execShellCommand";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WireGuard.Peer[]>,
) {
  const clients = await getAllClients("wg0.conf");

  res.status(200).json(clients);
}

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
