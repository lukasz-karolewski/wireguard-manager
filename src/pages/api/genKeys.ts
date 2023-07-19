import type { NextApiRequest, NextApiResponse } from "next";
import { GetKeysResponse } from "~/types";
import { execShellCommand } from "~/utils/execShellCommand";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetKeysResponse | { error: string }>,
) {
  const private_key = await execShellCommand("wg genkey");
  const public_key = await execShellCommand(`echo "${private_key}" | wg pubkey`);

  res.status(200).json({ private_key, public_key });
}
