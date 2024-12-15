"use client";

import NiceModal from "@ebay/nice-modal-react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { FC, use, useState } from "react";

import { AddEditClientModal, mapClientForEdit } from "~/components/app/AddEditClientModal";
import ConfirmModal from "~/components/app/ConfirmModal";
import WgConfig from "~/components/app/WgConfig";
import Accordion from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/react";

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const ClientDetailPage: FC<ClientDetailPageProps> = (props) => {
  const params = use(props.params);
  const [show, setShowConfig] = useState<"config" | "qr">("qr");
  const router = useRouter();

  const { data: clients, refetch } = api.client.get.useQuery({ id: Number(params.id) });
  const { mutate: disableClient } = api.client.disable.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });
  const { mutate: enableClient } = api.client.enable.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });
  const { mutate: removeClient } = api.client.remove.useMutation({
    onSuccess: () => {
      router.push("/");
    },
  });
  const { mutate: addToSite } = api.client.addToSite.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });
  const { mutate: removeFromSite } = api.client.removeFromSite.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  async function downloadAllConfigsForSite(siteId: number) {
    if (!clients?.client?.id) {
      console.log("no id");
      return;
    }

    //make a POST request to the server to download the zip file
    const response = await fetch(
      `/api/download/${clients.client.id.toString()}/${siteId.toString()}`,
      {
        method: "POST",
      },
    );

    const blob = await response.blob();
    const contentDisposition = response.headers.get("Content-Disposition");
    const suggestedName = contentDisposition?.split("filename=")[1] ?? "config.zip";

    // Use File System Access API to save the file

    if ("showSaveFilePicker" in globalThis) {
      try {
        // TODO pending fix https://github.com/microsoft/vscode/issues/141908
        const handle = await (globalThis as any).showSaveFilePicker({
          suggestedName,
          types: [
            {
              accept: {
                "application/zip": [".zip"],
              },
              description: "Zip Files",
            },
          ],
        });

        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      } catch (error) {
        console.error(error);
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
    if (!clients) return;
    disableClient({ id: clients.client!.id });
  }

  function onEnable() {
    if (!clients) return;
    enableClient({ id: clients.client!.id });
  }

  async function onRemove() {
    if (!clients) return;
    await NiceModal.show(ConfirmModal, {
      actionName: "Remove",
      message: (
        <>
          <p>
            You are about to remove the client <strong>{clients.client?.name}</strong>.
          </p>
          <p>
            This action <strong>cannot</strong> be undone. Are you sure?
          </p>
        </>
      ),
      title: "Remove client",
    });
    removeClient({ id: clients.client!.id });
  }

  async function onEdit() {
    if (!clients) return;
    await NiceModal.show(AddEditClientModal, {
      client: mapClientForEdit(clients.client),
    });
    void refetch();
  }

  function handleSiteToggle(siteId: number, isConnected: boolean) {
    if (!clients) return;
    if (isConnected) {
      removeFromSite({ clientId: clients.client!.id, siteId });
    } else {
      addToSite({ clientId: clients.client!.id, siteId });
    }
  }

  return (
    <>
      <PageHeader parent="Clients" parentHref="/" title={`${clients?.client?.name}`}>
        {clients?.client?.enabled && (
          <>
            <Button
              className="hidden md:block"
              onClick={() => {
                setShowConfig(show === "qr" ? "config" : "qr");
              }}
              variant={"ghost"}
            >
              {show == "qr" ? "Show configs" : "Show QR codes"}
            </Button>
            <Button onClick={onEdit} variant="ghost">
              Edit
            </Button>
            <Button className="hidden md:block" onClick={onDisable} variant="ghost">
              Disable
            </Button>
          </>
        )}
        {!clients?.client?.enabled && (
          <>
            <Button className="hidden md:block" onClick={onEnable} variant="default">
              Enable
            </Button>
          </>
        )}
        <Button className="hidden md:block" onClick={onRemove} variant="destructive">
          Remove
        </Button>
      </PageHeader>
      {clients?.client?.enabled && (
        <div className="hidden md:block">
          <div>Created By: {clients.client.createdBy.name}</div>
          <div>Created: {clients.client.createdAt.toISOString()}</div>
          <div>Updated: {clients.client.updatedAt.toISOString()}</div>
          <div>Email: {clients.client.email}</div>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {clients?.configs
          .sort((a, b) => (a.site.isDefault === b.site.isDefault ? 0 : a.site.isDefault ? -1 : 1))
          .map(({ configs, site }) => {
            const isConnected = clients.client?.sites.some((s) => s.id === site.id) ?? false;
            return (
              <Accordion
                actions={
                  <>
                    <Button onClick={() => downloadAllConfigsForSite(site.id)} variant="ghost">
                      <span className="hidden md:inline">download all configs</span>
                      <DocumentArrowDownIcon className="ml-2 size-5" />
                    </Button>
                    <Button
                      onClick={() => {
                        handleSiteToggle(site.id, isConnected);
                      }}
                      variant="ghost"
                    >
                      {isConnected ? "Remove from site" : "Add to site"}
                    </Button>
                  </>
                }
                className={clsx({ "bg-green-300": site.isDefault })}
                header={`${site.name} @ ${site.endpointAddress}`}
                isInitiallyOpen={site.isDefault}
                key={site.id}
              >
                <div className={clsx("border")}>
                  <div className="flex flex-wrap justify-around gap-4">
                    {configs.map((config, index) => (
                      <WgConfig
                        clientName={clients.client!.name}
                        config={config}
                        key={index}
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
