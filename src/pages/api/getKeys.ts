import type { NextApiRequest, NextApiResponse } from "next";
import { execShellCommand } from "~/utils/execShellCommand";

type GetKeysResponse = {
  private_key: string;
  public_key: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<GetKeysResponse>) {
  const private_key = await execShellCommand("wg genkey");
  const public_key = await execShellCommand(`echo "${private_key}" | wg pubkey`);

  res.status(200).json({ private_key, public_key });
}
