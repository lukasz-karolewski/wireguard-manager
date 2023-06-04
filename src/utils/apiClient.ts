import { GetKeysResponse, GlobalConfig } from "~/types";

async function getNewKeyPair(name: string): Promise<GetKeysResponse> {
  const res = await fetch(`/api/genKeys?name=${name}`);
  return await res.json();
}

async function getServers() {
  const res = await fetch(`/api/getServers`);
  return await res.json();
}

async function saveConfig(config: GlobalConfig) {
  const res = await fetch(`/api/saveConfig`, {
    method: "POST",
    body: JSON.stringify(config),
  });
  return await res.json();
}

export default { getNewKeyPair, getServers, saveConfig };
