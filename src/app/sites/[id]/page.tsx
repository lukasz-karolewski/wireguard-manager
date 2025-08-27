"use client";

import NiceModal from "@ebay/nice-modal-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, use } from "react";
import { toast } from "react-hot-toast";

import { AddEditSiteModal, mapSiteForEdit } from "~/components/app/AddEditSiteModal";
import { ConfigDiff } from "~/components/app/ConfigDiff";
import ConfirmModal from "~/components/app/ConfirmModal";
import { Button } from "~/components/ui/button";
import { InfoCard } from "~/components/ui/info-card";
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

  const { data: writeCheck } = api.site.needsWrite.useQuery({ id: +params.id });

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

  const { isPending: isTesting, mutate: testSshConnection } =
    api.site.testSshConnection.useMutation({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: (result) => {
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
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
        <Button
          disabled={isPosting || !data?.site.configChanged}
          onClick={() => {
            writeConfig({ id: data!.site.id });
          }}
          variant="ghost"
        >
          Write config
        </Button>

        {data?.site.hostname && (
          <Button
            className="hidden md:block"
            disabled={isTesting}
            onClick={() => {
              testSshConnection({ id: data.site.id });
            }}
            variant="ghost"
          >
            {isTesting ? "Testing..." : "Test SSH"}
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
      <div className="space-y-3">
        {!!writeCheck?.errorMessage && (
          <InfoCard
            className="border-red-200"
            items={[{ label: "Remote read error", value: writeCheck.errorMessage }]}
          />
        )}
        <ConfigDiff
          leftLabel="Current"
          newValue={writeCheck?.config ?? ""}
          oldValue={writeCheck?.currentConfig ?? ""}
          rightLabel="Generated"
        />
      </div>
    </>
  );
};

export default SiteDetailPage;
