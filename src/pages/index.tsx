import { QRCodeSVG } from "qrcode.react";
import React, { FC, useEffect, useState } from "react";
import { Button, Layout } from "~/components/ui";
import { ServerConfig } from "~/model/server";
import { ClientConfig, makeClientConfig } from "~/model/client";
import { getNewKeyPair, getServers } from "~/utils/client";

import { Switch } from '@headlessui/react'
import { setConfig } from "next/config";

type ClientConfigProps = {
  config: ClientConfig;
};

const ClientConfigView: FC<React.PropsWithChildren<ClientConfigProps>> = ({ config }) => {

  const [show, setShowConfig] = useState<"qr" | "config">('qr');

  function clientConfigTemplate(config: ClientConfig) {
    return `[Interface]
        Address = ${config.interface_address}
        PrivateKey = ${config.client_private_key}
        DNS = ${config.dns}

        [Peer]
        PublicKey = ${config.server_public_key}
        AllowedIPs = ${config.allowed_ips}
        Endpoint = ${config.server_endpoint}
        `
      .split("\n")
      .map((line) => line.trim())
      .join("\n");
  }

  return (
    <div className="bg-gray-100 justify-evenly mb-2 last:mb-0 overflow-auto">

      <Switch
        checked={show === "qr"}
        onChange={(v: boolean) => {
          setShowConfig(v ? "qr" : "config")
        }}
        className={`${show ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span className="sr-only">{show === 'config' ? "Show QR" : "Raw config"}</span>
        <span
          className={`${show ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white`}
        />
      </Switch>
      <div className="p-2  bg-blue-100  overflow-auto">
        {show == "config" && <pre>{clientConfigTemplate(config)}</pre>}
        {show == "qr" && (
          <div className="grid grid-cols-2">
            <div className="mx-auto">
              <QRCodeSVG value={clientConfigTemplate(config)} size={256} />
            </div>
            <ul>
              <li className="font-bold">{config.nickname}</li>
              <li>Interface address {config.interface_address}</li>
              <li>Allowed IP's {config.allowed_ips}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// function AddPeerForm() {
//   const [clientId, setClientId] = useState(1);
//   const [privateKey, setPrivateKey] = useState("");
//   const [publicKey, setPublicKey] = useState("");
//   const [description, setDescription] = useState("");

//   return (
//     <>
//       <input
//         className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//         type="number"
//         min={1}
//         max={254}
//         step={1}
//         value={clientId}
//         onChange={(event) => {
//           setClientId(+event.target.value);
//         }}
//       />

//       <input
//         className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//         type="text"
//         value={privateKey}
//         readOnly
//       />

//       <input
//         className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//         type="text"
//         value={description}
//         onChange={(event) => setDescription(event.target.value)}
//       />
//     </>
//   );
// }


type Peer = {
  name: string,
  configs: ClientConfig[]
}

export default function Home() {
  let i = 1;
  const [servers, setServers] = useState<ServerConfig[]>([]);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [peerName, setPeerName] = useState('');


  const handlePeerNameChange = (event) => {
    setPeerName(event.target.value);
  };

  useEffect(() => {
    getServers().then((d) => {
      console.log(d);
      setServers(d);
    });
  });

  const handleAddPeer = () => {
    if (peerName.trim() !== '') {
      newPeer(peerName);
      setPeerName('');
    }
  };

  async function newPeer(name) {
    const peerId = i++;
    const nickname = "test";
    const keyPair = await getNewKeyPair(name);

    let configs: ClientConfig[] = [];

    servers.forEach((server) =>
      configs.push(
        makeClientConfig(`${server.name}`, server, peerId, keyPair.private_key, keyPair.public_key)
      )
    );
    setPeers((c) => [...c, { name: nickname, configs }]);
  }

  return (
    <Layout>
      <input type="text" className="border" value={peerName} onChange={handlePeerNameChange} />
      <Button onClick={handleAddPeer} disabled={!peerName.trim()}>Add Peer</Button>

      {peers.map((p) => (
        <>
          <div>{p.name}</div>
          {p.configs.map(c => (
            <ClientConfigView key={c.client_public_key} config={c} />
          ))}

        </>
      ))}

    </Layout>
  );
}
