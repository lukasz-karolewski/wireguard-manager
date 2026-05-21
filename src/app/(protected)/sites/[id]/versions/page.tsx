import type { FC } from "react";

import { ConfigDiff } from "~/components/app/ConfigDiff";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/server";

interface SiteDetailPageProps {
  params: Promise<{ id: string }>;
}

const SiteConfigVersionsPage: FC<SiteDetailPageProps> = async ({ params }) => {
  const { id } = await params;
  const data = await api.site.getVersions.query({
    id: Number(id),
  });
  const versions = data.versions;
  const first = versions.at(-1);

  return (
    <>
      <PageHeader parent={["Sites", data.site.name]} parentHref={`/sites/${data.site.id}`} title="Versions" />
      {versions.length === 0 && <div className="rounded-md border p-3 text-sm text-gray-600">No versions found.</div>}

      {first && (
        <div className="flex flex-col gap-6">
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
