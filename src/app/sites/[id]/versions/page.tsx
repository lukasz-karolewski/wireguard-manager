"use client";

import { FC, use } from "react";

import Accordion from "~/components/ui/accordion";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/react";

interface SiteDetailPageProps {
  params: Promise<{ id: string }>;
}

const SiteConfigVersionsPage: FC<SiteDetailPageProps> = (props) => {
  const params = use(props.params);

  const { data } = api.site.getVersions.useQuery({
    id: +params.id,
  });

  return (
    <>
      <PageHeader
        parent={["Sites", data?.site.name ?? ""]}
        parentHref={`/sites/${data?.site.id}`}
        title="Versions"
      />
      {data?.versions.map((version) => (
        <div key={version.hash}>
          <Accordion header={`${version.createdBy.name} @ ${version.createdAt.toString()} `}>
            <pre>{version.data}</pre>
          </Accordion>
        </div>
      ))}
    </>
  );
};

export default SiteConfigVersionsPage;
