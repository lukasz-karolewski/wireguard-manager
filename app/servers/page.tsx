import { Button, Layout, Link } from "~/app/ui/common";
import { GlobalConfig } from "~/app/lib/types";

import NiceModal from "@ebay/nice-modal-react";
import useSwr from "swr";
import AddServerModal from "~/app/ui/components/AddServerModal";
import { ServerItem } from "~/app/ui/components/ServerItem";

export default function Home() {
  const { data: config, isLoading } = useSwr<GlobalConfig>("/api/loadConfig");
  if (!config) return <></>;

  return (
    <Layout>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => NiceModal.show(AddServerModal)}>Add Server</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {config?.servers?.map((server) => {
          return (
            <Link key={server.name} href={`/servers/${server.name}`}>
              <ServerItem server={server} />
            </Link>
          );
        })}
      </div>
    </Layout>
  );
}
