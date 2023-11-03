import { unstable_noStore as noStore } from "next/cache";
import { KeyPair } from "~/app/lib/types";
import { execShellCommand } from "~/app/lib/utils/execShellCommand";

export const genKeys = async (): Promise<KeyPair> => {
  const private_key = await execShellCommand("wg genkey");
  const public_key = await execShellCommand(`echo "${private_key}" | wg pubkey`);
  noStore();

  return { private_key, public_key };
};
