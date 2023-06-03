import { GetKeysResponse } from "~/types";

async function getNewKeyPair(name: string): Promise<GetKeysResponse> {
  const res = await fetch(`/api/genKeys?name=${name}`);
  return await res.json();
}

async function getServers() {
  const res = await fetch(`/api/getServers`);
  return await res.json();
}

export { getNewKeyPair, getServers };
