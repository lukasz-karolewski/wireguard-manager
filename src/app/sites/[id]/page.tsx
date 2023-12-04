"use client";

import { FC } from "react";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/react";

type SiteDetailPageProps = { params: { id: string } };

const SiteDetailPage: FC<SiteDetailPageProps> = ({ params }) => {
  const router = useRouter();

  const { data } = api.site.get.useQuery({
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
      <PageHeader title={`Sites > ${data?.site.name}`}></PageHeader>
      <pre
        className="bg-slate-200 p-4"
        onCopy={(e) => {
          e.preventDefault();
          e.clipboardData.setData("text/plain", data!.config);
          toast.success("Copied to clipboard");
        }}
      >
        {data?.config}
      </pre>
      <Button variant={"destructive"} onClick={() => removeSite({ id: +params.id })}>
        Delete
      </Button>
    </>
  );
};

export default SiteDetailPage;
