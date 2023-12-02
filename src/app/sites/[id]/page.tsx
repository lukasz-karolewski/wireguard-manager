"use client";

import { FC } from "react";

import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

type SiteDetailPageProps = { params: { id: string } };

const SiteDetailPage: FC<SiteDetailPageProps> = ({ params }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: config } = api.site.getConfig.useQuery({
    id: +params.id,
  });

  const { mutate: removeSite } = api.site.remove.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      router.push("/sites");
    },
  });

  return (
    <>
      <pre
        className="bg-slate-200 p-4"
        onCopy={(e) => {
          e.preventDefault();
          e.clipboardData.setData("text/plain", config!);
          toast.success("Copied to clipboard");
        }}
      >
        {config}
      </pre>
      <Button onClick={() => removeSite({ id: +params.id })}>Delete</Button>
      {/* <h3 className="text-lg">
        <Link href="/servers">Servers</Link> &gt; {server_name}
      </h3>
      <ServerConfigView config={config} server_name={server.name} /> */}
    </>
  );
};

export default SiteDetailPage;
