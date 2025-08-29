"use client";

import { type FC, use } from "react";

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
  const first = versions.at(-1);

  return (
    <>
      <PageHeader parent={["Sites", data?.site.name ?? ""]} parentHref={`/sites/${data?.site.id}`} title="Versions" />
      {versions.length === 0 && <div className="rounded-md border p-3 text-sm text-gray-600">No versions found.</div>}

      {first && (
        <div className="space-y-6">
          {/* Diffs between consecutive versions with list ordered newest -> oldest */}
          {versions.slice(0, -1).map((curr, idx) => {
            const prev = versions[idx + 1]; // the next element is the previous (older) version chronologically
            return (
              <ConfigDiff
                key={`${curr.hash}-${prev.hash}`}
                leftLabel={`${prev.createdBy.name} @ ${new Date(prev.createdAt).toLocaleString()}`}
                newValue={curr.data} // newer
                oldValue={prev.data} // older
                rightLabel={`${curr.createdBy.name} @ ${new Date(curr.createdAt).toLocaleString()}`}
                showUnchanged={false}
              />
            );
          })}

          <div className="overflow-hidden rounded-md border">
            <div className="border-b bg-gray-50 px-3 py-2 text-xs text-gray-500">
              {new Date(first.createdAt).toLocaleString()} by {first.createdBy.name}
            </div>
            <pre className="font-mono text-sm px-3 py-2 whitespace-pre-wrap">{first.data}</pre>
          </div>
        </div>
      )}
    </>
  );
};

export default SiteConfigVersionsPage;
