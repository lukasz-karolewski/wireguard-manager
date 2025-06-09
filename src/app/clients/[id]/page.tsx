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
import { downloadAllConfigsForSite } from "~/utils";

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const ClientDetailPage: FC<ClientDetailPageProps> = (props) => {
  const params = use(props.params);
  const [show, setShowConfig] = useState<"config" | "qr">("qr");
  const router = useRouter();

  const { data: clientData, refetch } = api.client.get.useQuery({ id: Number(params.id) });
  const { data: sites } = api.site.getAll.useQuery();

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

  function onDisable() {
    if (!clientData) return;
    disableClient({ id: clientData.client.id });
  }

  function onEnable() {
    if (!clientData) return;
    enableClient({ id: clientData.client.id });
  }

  async function onRemove() {
    if (!clientData) return;
    await NiceModal.show(ConfirmModal, {
      actionName: "Remove",
      message: (
        <>
          <p>
            You are about to remove the client <strong>{clientData.client.name}</strong>.
          </p>
          <p>
            This action <strong>cannot</strong> be undone. Are you sure?
          </p>
        </>
      ),
      title: "Remove client",
    });
    removeClient({ id: clientData.client.id });
  }

  async function onEdit() {
    if (!clientData) return;
    await NiceModal.show(AddEditClientModal, {
      client: mapClientForEdit(clientData.client),
    });
    void refetch();
  }

  if (!clientData) return null;
  if (!sites) return null;

  return (
    <>
      <PageHeader parent="Clients" parentHref="/" title={clientData.client.name}>
        {clientData.client.enabled && (
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
        {!clientData.client.enabled && (
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
      {clientData.client.enabled && (
        <div className="hidden md:block">
          <div>
            Created By: {clientData.client.createdBy.name} ({clientData.client.createdBy.email})
          </div>
          <div>Created: {clientData.client.createdAt.toISOString()}</div>
          <div>Updated: {clientData.client.updatedAt.toISOString()}</div>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {sites
          .sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1))
          .map((site) => {
            const siteConfigs = clientData.configs.find((c) => c.site.id === site.id);

            return siteConfigs ? (
              <Accordion
                actions={
                  <>
                    <Button
                      onClick={() => {
                        downloadAllConfigsForSite(clientData.client.id, site.id);
                      }}
                      variant="ghost"
                    >
                      <span className="hidden md:inline">download all configs</span>
                      <DocumentArrowDownIcon className="ml-2 size-5" />
                    </Button>
                    <Button
                      onClick={() => {
                        removeFromSite({ clientId: clientData.client.id, siteId: site.id });
                      }}
                      variant="ghost"
                    >
                      Remove from site
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
                    {siteConfigs.configs.map((config, index) => (
                      <WgConfig
                        clientName={clientData.client.name}
                        config={config}
                        key={index}
                        show={show}
                      />
                    ))}
                  </div>
                </div>
              </Accordion>
            ) : (
              <Accordion
                actions={
                  <Button
                    onClick={() => {
                      addToSite({ clientId: clientData.client.id, siteId: site.id });
                    }}
                    variant="default"
                  >
                    Add to site
                  </Button>
                }
                header={site.name + " - inactive"}
                key={site.id}
              ></Accordion>
            );
          })}
      </div>
    </>
  );
};

export default ClientDetailPage;
