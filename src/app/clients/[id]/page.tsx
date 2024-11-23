"use client";
import NiceModal from "@ebay/nice-modal-react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { FC, use, useState } from "react";
import { AddEditClientModal, mapClientForEdit } from "~/components/app/AddEditClientModal";
import ConfirmModal from "~/components/app/ConfirmModal";
import WgConfig from "~/components/app/WgConfig";
import Accordion from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/react";

type ClientDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ClientDetailPage: FC<ClientDetailPageProps> = (props) => {
  const params = use(props.params);
  const [show, setShowConfig] = useState<"qr" | "config">("qr");
  const router = useRouter();

  const { data, refetch } = api.client.get.useQuery({ id: Number(params.id) });
  const { mutate: disableClient } = api.client.disable.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const { mutate: enableClient } = api.client.enable.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const { mutate: removeClient } = api.client.remove.useMutation({
    onSuccess: () => {
      router.push("/");
    },
  });
  const { mutate: addToSite } = api.client.addToSite.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const { mutate: removeFromSite } = api.client.removeFromSite.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  async function downloadAllConfigsForSite(siteId: number) {
    //make a POST request to the server to download the zip file
    const response = await fetch(`/api/download/${data?.client.id}/${siteId}`, { method: "POST" });

    const blob = await response.blob();
    const contentDisposition = response.headers.get("Content-Disposition");
    const suggestedName = contentDisposition?.split("filename=")[1] ?? "config.zip";

    // Use File System Access API to save the file

    if ("showSaveFilePicker" in window) {
      try {
        // TODO pending fix https://github.com/microsoft/vscode/issues/141908
        const handle = await (window as any).showSaveFilePicker({
          suggestedName,
          types: [
            {
              description: "Zip Files",
              accept: {
                "application/zip": [".zip"],
              },
            },
          ],
        });

        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      } catch (e) {
        console.error(e);
      }
    } else {
      // Fallback for browsers that do not support the File System Access API
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = suggestedName;
      link.click();
      URL.revokeObjectURL(downloadUrl);
    }
  }

  function onDisable() {
    if (!data) return;
    disableClient({ id: data.client.id });
  }

  function onEnable() {
    if (!data) return;
    enableClient({ id: data.client.id });
  }

  async function onRemove() {
    if (!data) return;
    await NiceModal.show(ConfirmModal, {
      title: "Remove client",
      message: (
        <>
          <p>
            You are about to remove the client <strong>{data.client.name}</strong>.
          </p>
          <p>
            This action <strong>cannot</strong> be undone. Are you sure?
          </p>
        </>
      ),
      actionName: "Remove",
    });
    removeClient({ id: data?.client.id });
  }

  async function onEdit() {
    if (!data) return;
    await NiceModal.show(AddEditClientModal, {
      client: mapClientForEdit(data.client),
    });
    refetch();
  }

  function handleSiteToggle(siteId: number, isConnected: boolean) {
    if (!data) return;
    if (isConnected) {
      removeFromSite({ clientId: data.client.id, siteId });
    } else {
      addToSite({ clientId: data.client.id, siteId });
    }
  }

  return (
    <>
      <PageHeader title={`${data?.client.name}`} parent="Clients" parentHref="/">
        {data?.client.enabled && (
          <>
            <Button
              className="hidden md:block"
              variant={"ghost"}
              onClick={() => setShowConfig(show === "qr" ? "config" : "qr")}
            >
              {show == "qr" ? "Show configs" : "Show QR codes"}
            </Button>
            <Button variant="ghost" onClick={onEdit}>
              Edit
            </Button>
            <Button className="hidden md:block" variant="ghost" onClick={onDisable}>
              Disable
            </Button>
          </>
        )}
        {!data?.client.enabled && (
          <>
            <Button className="hidden md:block" variant="default" onClick={onEnable}>
              Enable
            </Button>
          </>
        )}
        <Button className="hidden md:block" variant="destructive" onClick={onRemove}>
          Remove
        </Button>
      </PageHeader>
      {data?.client.enabled && (
        <div className="hidden md:block">
          <div>Created By: {data?.client.createdBy.name}</div>
          <div>Created: {data?.client.createdAt.toISOString()}</div>
          <div>Updated: {data?.client.updatedAt.toISOString()}</div>
          <div>Email: {data?.client.email}</div>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {data?.configs
          .sort((a, b) => (a.site.isDefault ? -1 : 1))
          .map(({ site, configs }) => {
            const isConnected = data?.client.sites?.some((s) => s.id === site.id) ?? false;
            return (
              <Accordion
                key={site.id}
                header={`${site.name} @ ${site.endpointAddress}`}
                actions={
                  <>
                    <Button variant="ghost" onClick={() => downloadAllConfigsForSite(site.id)}>
                      <span className="hidden md:inline">download all configs</span>
                      <DocumentArrowDownIcon className="ml-2 size-5" />
                    </Button>
                    <Button variant="ghost" onClick={() => handleSiteToggle(site.id, isConnected)}>
                      {isConnected ? "Remove from site" : "Add to site"}
                    </Button>
                  </>
                }
                className={clsx({ "bg-green-300": site.isDefault })}
                isInitiallyOpen={site.isDefault}
              >
                <div className={clsx("border")}>
                  <div className="flex flex-wrap justify-around gap-4">
                    {configs.map((config, index) => (
                      <WgConfig
                        key={index}
                        config={config}
                        clientName={data?.client.name}
                        show={show}
                      />
                    ))}
                  </div>
                </div>
              </Accordion>
            );
          })}
      </div>
    </>
  );
};

export default ClientDetailPage;
