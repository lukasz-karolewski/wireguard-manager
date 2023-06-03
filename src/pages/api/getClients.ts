import { execShellCommand } from "~/utils/execShellCommand";
import { ClientObject } from "~/types";
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
            const clientObject: ClientObject = {
                name: getComment(client),
                privateKey: getAttr(client, "PrivateKey"),
                publicKey: getAttr(client, "PublicKey"),
                allowedIPs: getAttr(client, "AllowedIPs"),
                endpoint: getAttr(client, "Endpoint"),
                persistentKeepalive: getAttr(client, "PersistentKeepalive"),
            };
            return clientObject;
        });
    return clients;
}

function getComment(client: string[]): string {
    return client.find((line) => line.match(/^#\s*[^#\n]+$/))?.replace("#", "").trim() ?? "";
}

function getAttr(client: string[], attrName: string): string {
    return client.find((line) => line.match(new RegExp(`^${attrName}`)))?.split("=")[1] ?? "";
}