"use client";

import { FC } from "react";

import { notFound, usePathname } from "next/navigation";
import { api } from "~/trpc/react";

type SiteDetailPageProps = { params: { id: string } };

const SiteDetailPage: FC<SiteDetailPageProps> = ({ params }) => {
  const pathname = usePathname();

  const { data: config } = api.site.getConfig.useQuery({ id: +params.id });
  if (!config) return notFound();

  return (
    <>
      <pre>{config}</pre>
      {/* <h3 className="text-lg">
        <Link href="/servers">Servers</Link> &gt; {server_name}
      </h3>
      <ServerConfigView config={config} server_name={server.name} /> */}
    </>
  );
};

export default SiteDetailPage;
