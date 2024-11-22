"use client";

import { FC, use } from "react";

import { useRouter } from "next/navigation";
import Accordion from "~/components/ui/accordion";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/react";

type SiteDetailPageProps = { params: Promise<{ id: string }> };

const SiteConfigVersionsPage: FC<SiteDetailPageProps> = (props) => {
  const params = use(props.params);
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
