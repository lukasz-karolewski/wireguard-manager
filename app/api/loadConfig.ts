import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { GlobalConfig } from "~/app/lib/types";

// read configuration.json file and retrun it
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GlobalConfig | { error: string }>,
) {
  const configPath = path.join(process.cwd(), "configuration.json");
  if (!fs.existsSync(configPath)) {
    res.status(400).json({ error: "Configuration file not found" });
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  res.status(200).json(config);
}
