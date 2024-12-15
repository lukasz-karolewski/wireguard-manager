import { unstable_noStore as noStore } from "next/cache";

import { execShellCommand } from "~/server/utils/execShellCommand";

export async function getAllClients(filename = "/etc/wireguard/wg0.conf") {
  const wgConfig = await execShellCommand(`cat ${filename}`);

  const clients = wgConfig.split(/\n(?=\[Peer\])/).map((clientConfig) => {
    const client = clientConfig.split("\n");
    const clientObject = {
      AllowedIPs: getAttr(client, "AllowedIPs"),
      Endpoint: getAttr(client, "Endpoint"),
      //   name: getComment(client),
      //   PrivateKey: getAttr(client, "PrivateKey"),
      PublicKey: getAttr(client, "PublicKey"),
      //   PersistentKeepalive: getAttr(client, "PersistentKeepalive"),
    };
    return clientObject;
  });

  noStore();
  return clients;
}

function getAttr(client: string[], attrName: string): string {
  return client.find((line) => new RegExp(`^${attrName}`).exec(line))?.split("=")[1] ?? "";
}

// function getComment(client: string[]): string {
//   return (
//     client
//       .find((line) => /^#\s*[^#\n]+$/.exec(line))
//       ?.replace("#", "")
//       .trim() ?? ""
//   );
// }
