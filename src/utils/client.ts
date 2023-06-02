import { sjc, waw, waw_wola } from "~/model/server";
import { GetKeysResponse } from "~/pages/api/types";

async function getNewKeyPair(name: string): Promise<GetKeysResponse> {
  const res = await fetch(`/api/getKeys?name=${name}`);
  return await res.json();
}

function getServers() {
  return Promise.resolve([sjc, waw, waw_wola]);
}

export { getNewKeyPair, getServers };
