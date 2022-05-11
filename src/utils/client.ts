import { sjc, waw, waw_wola } from "~/model/server";
import { GetKeysResponse } from "~/pages/api/getKeys";

async function getNewKeyPair(): Promise<GetKeysResponse> {
  const res = await fetch("/api/getKeys");
  return await res.json();
}

function getServers() {
  return Promise.resolve([sjc, waw, waw_wola]);
}

export { getNewKeyPair, getServers };
