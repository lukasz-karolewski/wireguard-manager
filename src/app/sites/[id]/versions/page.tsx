"use client";

import { FC, use } from "react";

import { ConfigDiff } from "~/components/app/ConfigDiff";
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

  const versions = data?.versions ?? [];
  const latest = versions[0];

  return (
    <>
      <PageHeader
        parent={["Sites", data?.site.name ?? ""]}
        parentHref={`/sites/${data?.site.id}`}
        title="Versions"
      />
      {versions.length === 0 && (
        <div className="rounded-md border p-3 text-sm text-gray-600">No versions found.</div>
      )}

      {versions.length > 0 && (
        <div className="space-y-6">
          {/* First version in full */}
          <div className="overflow-hidden rounded-md border">
            <div className="border-b bg-gray-50 px-3 py-2 text-xs text-gray-500">
              Full config @ {new Date(latest.createdAt).toLocaleString()} by{" "}
              {latest.createdBy.name}
            </div>
            <pre className="font-mono text-sm px-3 py-2 whitespace-pre-wrap">{latest.data}</pre>
          </div>

          {/* Diffs between consecutive versions */}
          {versions.slice(1).map((prev, idx) => {
            const curr = versions[idx]; // versions[idx] corresponds to the item before prev in the original array
            return (
              <ConfigDiff
                key={`${curr.hash}-${prev.hash}`}
                leftLabel={`${prev.createdBy.name} @ ${new Date(prev.createdAt).toLocaleString()}`}
                newValue={curr.data}
                oldValue={prev.data}
                rightLabel={`${curr.createdBy.name} @ ${new Date(curr.createdAt).toLocaleString()}`}
                showUnchanged={false}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default SiteConfigVersionsPage;
