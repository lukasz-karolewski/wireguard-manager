"use client";

import { FC } from "react";

import NiceModal from "@ebay/nice-modal-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ConfirmModal from "~/components/app/ConfirmModal";
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

  const { mutate: setAsDefault } = api.site.setAsDefault.useMutation({
    onSuccess: () => {
      toast.success(`${data?.site.name} is now the default site`);
    },
  });

  async function onRemove() {
    if (!data) return;
    await NiceModal.show(ConfirmModal, {
      title: "Remove Site",
      message: (
        <>
          <p>
            You are about to remove the site <strong>{data.site.name}</strong>.
          </p>
          <p>
            This action <strong>cannot</strong> be undone. Are you sure?
          </p>
        </>
      ),
      actionName: "Remove",
    });
    removeSite({ id: data.site.id });
  }

  return (
    <>
      <PageHeader title={`Sites > ${data?.site.name}`}>
        <Button variant={"ghost"} onClick={() => setAsDefault({ id: data!.site.id })}>
          Mark As Default
        </Button>
        <Button variant={"destructive"} onClick={onRemove}>
          Remove
        </Button>
      </PageHeader>
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
    </>
  );
};

export default SiteDetailPage;
