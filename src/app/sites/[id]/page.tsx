"use client";

import { FC } from "react";

import NiceModal from "@ebay/nice-modal-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AddEditSiteModal, mapSiteForEdit } from "~/components/app/AddEditSiteModal";
import ConfirmModal from "~/components/app/ConfirmModal";
import { Button } from "~/components/ui/button";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/react";

type SiteDetailPageProps = { params: { id: string } };

const SiteDetailPage: FC<SiteDetailPageProps> = ({ params }) => {
  const router = useRouter();

  const { data, refetch } = api.site.get.useQuery({
    id: +params.id,
  });

  const { mutate: writeConfig, isLoading: isPosting } = api.site.writeSiteConfigToDisk.useMutation(
    {
      onSuccess: (ret) => {
        switch (ret) {
          case "no_changes":
            toast.success("Config is identical, no changes were made");
            break;
          case "written":
            toast.success("Config written");
            break;
        }
      },
      onError: (err) => {
        toast.error(err.message);
      },
    },
  );

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
      <PageHeader title={`${data?.site.name}`} parent="Sites" parentHref={"/sites"}>
        {data?.site.isDefault && (
          <Button
            variant="ghost"
            disabled={isPosting}
            onClick={() => {
              writeConfig({ id: data?.site.id });
            }}
          >
            Write config
          </Button>
        )}
        <Button
          variant={"ghost"}
          onClick={() => {
            //set data!.config to clipboard
            navigator.clipboard.writeText(data!.config);
            toast.success("Copied to clipboard");
          }}
        >
          Copy to clipboard
        </Button>
        <Button
          variant={"ghost"}
          onClick={async () => {
            if (!data) return;
            await NiceModal.show(AddEditSiteModal, { site: mapSiteForEdit(data.site) });
            refetch();
          }}
        >
          Edit
        </Button>
        <Link href={`/sites/${data?.site.id}/versions`}>
          <Button variant={"ghost"}>Versions</Button>
        </Link>
        {!data?.site.isDefault && (
          <Button
            variant={"ghost"}
            onClick={() => {
              setAsDefault({ id: data!.site.id });
              refetch();
            }}
          >
            Mark As Default
          </Button>
        )}
        <Button variant={"destructive"} onClick={onRemove}>
          Remove
        </Button>
      </PageHeader>
      <pre className="bg-slate-200 p-4">{data?.config}</pre>
    </>
  );
};

export default SiteDetailPage;
