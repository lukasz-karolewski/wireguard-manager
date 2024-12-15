"use client";

import NiceModal from "@ebay/nice-modal-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, use } from "react";
import { toast } from "react-hot-toast";

import { AddEditSiteModal, mapSiteForEdit } from "~/components/app/AddEditSiteModal";
import ConfirmModal from "~/components/app/ConfirmModal";
import { Button } from "~/components/ui/button";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/react";

interface SiteDetailPageProps {
  params: Promise<{ id: string }>;
}

const SiteDetailPage: FC<SiteDetailPageProps> = (props) => {
  const params = use(props.params);
  const router = useRouter();

  const { data, refetch } = api.site.get.useQuery({
    id: +params.id,
  });

  const { isPending: isPosting, mutate: writeConfig } = api.site.writeSiteConfigToDisk.useMutation(
    {
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: (ret) => {
        switch (ret) {
          case "no_changes": {
            toast.success("Config is identical, no changes were made");
            break;
          }
          case "written": {
            toast.success("Config written");
            break;
          }
        }
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
      actionName: "Remove",
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
      title: "Remove Site",
    });
    removeSite({ id: data.site.id });
  }

  return (
    <>
      <PageHeader parent="Sites" parentHref={"/sites"} title={data?.site.name ?? ""}>
        {data?.site.isDefault && (
          <Button
            disabled={isPosting || !data.site.configChanged}
            onClick={() => {
              writeConfig({ id: data.site.id });
            }}
            variant="ghost"
          >
            Write config
          </Button>
        )}
        <Button
          className="hidden md:block"
          onClick={() => {
            //set data!.config to clipboard
            void navigator.clipboard.writeText(data!.config);
            toast.success("Copied to clipboard");
          }}
          variant={"ghost"}
        >
          Copy to clipboard
        </Button>
        <Button
          onClick={async () => {
            if (!data) return;
            await NiceModal.show(AddEditSiteModal, { site: mapSiteForEdit(data.site) });
            refetch();
          }}
          variant={"ghost"}
        >
          Edit
        </Button>
        <Link href={`/sites/${data?.site.id}/versions`}>
          <Button variant={"ghost"}>Versions</Button>
        </Link>
        {!data?.site.isDefault && (
          <Button
            className="hidden md:block"
            onClick={() => {
              setAsDefault({ id: data!.site.id });
              refetch();
            }}
            variant={"ghost"}
          >
            Mark As Default
          </Button>
        )}
        <Button className="hidden md:block" onClick={onRemove} variant={"destructive"}>
          Remove
        </Button>
      </PageHeader>
      <pre className="overflow-auto bg-slate-200 p-4">{data?.config}</pre>
    </>
  );
};

export default SiteDetailPage;
