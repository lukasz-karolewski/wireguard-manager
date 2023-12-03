"use client";
import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { QRCodeSVG } from "qrcode.react";
import { FC, useState } from "react";
import Accordion from "~/components/ui/accordion";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/react";

type ClientDetailPageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const ClientDetailPage: FC<ClientDetailPageProps> = ({ params }) => {
  const [show, setShowConfig] = useState<"qr" | "config">("qr");

  const { data } = api.client.get.useQuery({ id: Number(params.id) });

  return (
    <>
      <PageHeader title={`Clients > ${data?.client.name}`}>
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
      </PageHeader>

      <div className="flex flex-col gap-4">
        {data?.configs
          .sort((a, b) => (a.site.isDefault ? -1 : 1))
          .map(({ site, configs }) => {
            return (
              <Accordion
                key={site.id}
                title={<h2>Configs for site "{site.name}"</h2>}
                isInitiallyOpen={site.isDefault}
              >
                <div className={clsx("bg-blue-100", { "bg-green-300": site.isDefault })}>
                  <div className="flex flex-wrap justify-between gap-4">
                    {configs.map((config, index) => {
                      return (
                        <div key={index} className="p-8">
                          <h3>{config.type}</h3>
                          {show == "config" && <pre>{config.value}</pre>}
                          {show == "qr" && <QRCodeSVG value={config.value} size={256} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Accordion>
            );
          })}
      </div>
    </>
  );
};

export default ClientDetailPage;
