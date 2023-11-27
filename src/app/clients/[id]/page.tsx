import { Switch } from "@headlessui/react";
import { FC, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import useSwr from "swr";
import { ClientConfigView } from "~/components/app/ClientConfigView";
import { GlobalConfig } from "~/server/utils/types";

type ClientDetailPageProps = { params: { id: string } };

const ClientDetailPage: FC<ClientDetailPageProps> = (params) => {
  const { data: config, isLoading } = useSwr<GlobalConfig>("/api/loadConfig");
  const router = useRouter();
  const [show, setShowConfig] = useState<"qr" | "config">("qr");

  const id = Number(router.query["id"]);
  if (!config) return <></>;
  const client = config.clients.find((val) => val.id == id);

  if (!client) return <></>;

  return (
    <>
      <h3 className="text-lg">
        <Link href="/">Clients</Link> &gt; {client.name}
      </h3>

      <Switch
        checked={show === "qr"}
        onChange={(v: boolean) => {
          setShowConfig(v ? "qr" : "config");
        }}
        className={`${show === "qr" ? "bg-teal-900" : "bg-teal-700"}
          relative inline-flex h-[28px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${show === "qr" ? "translate-x-4" : "translate-x-0"}
            pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>

      <div className="flex flex-col gap-4">
        {config.servers.map((server) => {
          return (
            <div className="bg-blue-100 p-4" key={server.name}>
              <h3>{server.name}</h3>
              <ClientConfigView server={server} client={client} show={show} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ClientDetailPage;