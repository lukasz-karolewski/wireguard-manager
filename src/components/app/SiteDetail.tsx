"use client";

import NiceModal from "@ebay/nice-modal-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { toast } from "react-hot-toast";

import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";
import { Button } from "../ui/button";
import { InfoCard } from "../ui/info-card";
import PageHeader from "../ui/page-header";
import { AddEditSiteModal, mapSiteForEdit } from "./AddEditSiteModal";
import { ConfigDiff } from "./ConfigDiff";

interface SiteDetailProps {
  data: RouterOutputs["site"]["get"];
}

export const SiteDetail: FC<SiteDetailProps> = ({ data }) => {
  const router = useRouter();
  const { data: writeCheck } = api.site.needsWrite.useQuery({ id: data.site.id });

  const refresh = () => {
    router.refresh();
  };

  const { isPending: isPosting, mutate: writeConfig } = api.site.writeSiteConfigToDisk.useMutation({
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
          router.refresh();
          break;
        }
      }
    },
  });

  const { mutate: setAsDefault } = api.site.setAsDefault.useMutation({
    onSuccess: () => {
      toast.success(`${data.site.name} is now the default site`);
      router.refresh();
    },
  });

  const { isPending: isTesting, mutate: testSshConnection } = api.site.testSshConnection.useMutation({
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

  return (
    <>
      <PageHeader parent="Sites" parentHref="/sites" title={data.site.name}>
        <Button
          disabled={isPosting || !data.site.configChanged}
          onClick={() => {
            writeConfig({ id: data.site.id });
          }}
          variant="ghost"
        >
          Write config
        </Button>

        {data.site.hostname && (
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
            void navigator.clipboard.writeText(data.config);
            toast.success("Copied to clipboard");
          }}
          variant="ghost"
        >
          Copy to clipboard
        </Button>
        <Button
          onClick={async () => {
            await NiceModal.show(AddEditSiteModal, { site: mapSiteForEdit(data.site) });
            refresh();
          }}
          variant="ghost"
        >
          Edit
        </Button>
        <Link href={`/sites/${data.site.id}/versions`}>
          <Button variant="ghost">Versions</Button>
        </Link>
        {!data.site.isDefault && (
          <Button
            className="hidden md:block"
            onClick={() => {
              setAsDefault({ id: data.site.id });
            }}
            variant="ghost"
          >
            Mark As Default
          </Button>
        )}
      </PageHeader>
      <div className="flex flex-col gap-3">
        {!!writeCheck?.errorMessage && (
          <InfoCard
            className="border-red-200"
            items={[{ label: "Remote read error", value: writeCheck.errorMessage }]}
          />
        )}
        <ConfigDiff
          leftLabel="Current"
          newValue={writeCheck?.config ?? data.config}
          oldValue={writeCheck?.currentConfig ?? ""}
          rightLabel="Generated"
        />
      </div>
    </>
  );
};
