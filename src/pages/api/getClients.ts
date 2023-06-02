import { execShellCommand } from "~/utils/execShellCommand";
import { ClientObject } from "./types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ClientObject[]>) {
    const clients = await getAllClients("wg0.conf")

    res.status(200).json(clients);
}

export async function getAllClients(filename = "/etc/wireguard/wg0.conf"): Promise<ClientObject[]> {
    const wgConfig = await execShellCommand(`cat ${filename}`);

    const clients = wgConfig
        .split(/\n(?=\[Peer\])/)
        .map((clientConfig) => {
            const client = clientConfig.split("\n");
            const comment = client.find((line) => line.match(/^#\s*[^#\n]+$/));
            const clientObject: ClientObject = {
                name: comment?.replace("#", "").trim() ?? "",
                privateKey: client.find((line) => line.match(/^PrivateKey/))?.split("=")[1] ?? "",
                publicKey: client.find((line) => line.match(/^PublicKey/))?.split("=")[1] ?? "",
                allowedIPs: client.find((line) => line.match(/^AllowedIPs/))?.split("=")[1] ?? "",
                endpoint: client.find((line) => line.match(/^Endpoint/))?.split("=")[1] ?? "",
                persistentKeepalive: client.find((line) => line.match(/^PersistentKeepalive/))?.split("=")[1] ?? "",
            };
            return clientObject;
        });
    return clients;
}

