const exec = require("await-exec");

export default async function handler(req, res) {
  const private_key = (await exec("wg genkey"))["stdout"].trim();
  const public_key = (await exec(`echo ${private_key} | wg pubkey`))["stdout"].trim();
  res.status(200).json({ private_key, public_key });
}
