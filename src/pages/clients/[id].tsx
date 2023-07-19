import { Switch } from "@headlessui/react";
import { FC, useState } from "react";
import { useConfig } from "~/providers/configProvider";

import { useRouter } from "next/router";
import { Layout, Link } from "~/components/ui";
import { ClientConfigView } from "~/components/ClientConfigView";

const ClientDetailPage: FC = () => {
  const { config } = useConfig();
  const router = useRouter();
  if (!config) return <></>;

  const id = Number(router.query["id"]);
  const client = config.clients.find((val) => val.id == id);
  if (!client) return <></>;

  const [show, setShowConfig] = useState<"qr" | "config">("qr");

  return (
    <Layout>
      <h3 className="text-lg">
        <Link href="/">Clients</Link> &gt; {client.name}
      </h3>

      <Switch
        checked={show === "qr"}
        onChange={(v: boolean) => {
          setShowConfig(v ? "qr" : "config");
        }}
        className={`${show === "qr" ? "bg-teal-900" : "bg-teal-700"}
          relative inline-flex h-[28px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${show === "qr" ? "translate-x-4" : "translate-x-0"}
            pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>

      <div className="flex flex-col gap-4">
        {config.servers.map((server) => {
          return (
            <div className="bg-blue-100 p-4">
              <h3>{server.name}</h3>
              <ClientConfigView server={server} client={client} show={show} />
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default ClientDetailPage;
