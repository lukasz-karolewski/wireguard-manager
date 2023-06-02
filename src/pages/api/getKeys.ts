import type { NextApiRequest, NextApiResponse } from "next";
import { execShellCommand } from "~/utils/execShellCommand";
import { GetKeysResponse } from "./types";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse<GetKeysResponse>) {
  const { name } = req.query;

  const keysDir = path.join(process.cwd(), "keys");
  if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir);
  }

  const privateKeyPath = path.join(keysDir, `${name}-private.key`);
  const publicKeyPath = path.join(keysDir, `${name}-public.key`);

  if (fs.existsSync(privateKeyPath) || fs.existsSync(publicKeyPath)) {
    res.status(400).json({ error: "Keys with that name already exist" });
    return;
  }

  const private_key = await execShellCommand("wg genkey");
  const public_key = await execShellCommand(`echo "${private_key}" | wg pubkey`);

  fs.writeFileSync(privateKeyPath, private_key);
  fs.writeFileSync(publicKeyPath, public_key);

  res.status(200).json({ private_key, public_key });
}
