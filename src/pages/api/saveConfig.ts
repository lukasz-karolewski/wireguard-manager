import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

// write configuration.json file and based on contets of req.body
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{} | { error: string }>,
) {
  try {
    const configPath = path.join(process.cwd(), "configuration.json");

    await fs.promises.writeFile(configPath, req.body);
    res.status(200).json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save configuration" });
  }
}
