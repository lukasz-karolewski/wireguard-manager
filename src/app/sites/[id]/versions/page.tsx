"use client";

import { FC } from "react";

import { useRouter } from "next/navigation";
import Accordion from "~/components/ui/accordion";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/react";

type SiteDetailPageProps = { params: { id: string } };

const SiteConfigVersionsPage: FC<SiteDetailPageProps> = ({ params }) => {
  const router = useRouter();

  const { data, refetch } = api.site.getVersions.useQuery({
    id: +params.id,
  });

  return (
    <>
      <PageHeader
        title="Versions"
        parent={["Sites", data?.site.name ?? ""]}
        parentHref={`/sites/${data?.site.id}`}
      ></PageHeader>
      {data &&
        data.versions.map((version) => (
          <div key={version.hash}>
            <Accordion title={`${version.createdBy.name} @ ${version.createdAt.toString()} `}>
              <pre>{version.data}</pre>
            </Accordion>
          </div>
        ))}
    </>
  );
};

export default SiteConfigVersionsPage;
