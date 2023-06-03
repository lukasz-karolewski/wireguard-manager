import React, { useEffect, useState } from "react";
import { Button, Layout } from "~/components/ui";

import { getNewKeyPair, getServers } from "~/utils/apiClient";
import { makeClientConfig } from "./api/model/client";
import { ClientConfig, ServerConfig } from "~/types";
import { ClientConfigView } from "~/components/ClientConfig";

export default function Home() {
  let i = 1;
  const [servers, setServers] = useState<ServerConfig[]>([]);
  const [peers, setPeers] = useState<ClientConfig[]>([]);
  const [peerName, setPeerName] = useState("");

  const handlePeerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPeerName(event.target.value);
  };

  useEffect(() => {
    getServers().then((d) => {
      console.log(d);
      setServers(d);
    });
  });

  const handleAddPeer = () => {
    if (peerName.trim() !== "") {
      newPeer(peerName);
      setPeerName("");
    }
  };

  async function newPeer(name: string) {
    const peerId = i++;
    const keyPair = await getNewKeyPair(name);

    let configs: ClientConfig[] = [];

    servers.forEach((server) =>
      configs.push(
        makeClientConfig(`${server.name}`, server, peerId, keyPair.private_key, keyPair.public_key)
      )
    );

    setPeers((c) => [...c, configs]);
  }

  return (
    <Layout>
      <input type="text" className="border" value={peerName} onChange={handlePeerNameChange} />
      <Button onClick={handleAddPeer} disabled={!peerName.trim()}>
        Add Peer
      </Button>

      {peers.map((p) => (
        <>
          <div>{p.name}</div>
          {p.configs.map((c) => (
            <ClientConfigView key={c.client_public_key} config={c} />
          ))}
        </>
      ))}
    </Layout>
  );
}
