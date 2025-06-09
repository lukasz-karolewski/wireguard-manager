"use client";

import NiceModal from "@ebay/nice-modal-react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { FC, use, useState } from "react";

import { AddEditClientModal, mapClientForEdit } from "~/components/app/AddEditClientModal";
import { ConfigGrid } from "~/components/app/ConfigGrid";
import ConfirmModal from "~/components/app/ConfirmModal";
import { SiteCard } from "~/components/app/SiteCard";
import { Button } from "~/components/ui/button";
import { InfoCard } from "~/components/ui/info-card";
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
        <div className="mb-8">
          <InfoCard
            items={[
              {
                color: "blue",
                label: "Created By",
                value: `${clientData.client.createdBy.name} (${clientData.client.createdBy.email})`,
              },
              {
                color: "green",
                label: "Created",
                value: new Date(clientData.client.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  month: "short",
                  year: "numeric",
                }),
              },
              {
                color: "purple",
                label: "Last Updated",
                value: new Date(clientData.client.updatedAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  month: "short",
                  year: "numeric",
                }),
              },
            ]}
            title="Client Information"
          />
        </div>
      )}

      <div className="space-y-6">
        {sites
          .sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1))
          .map((site) => {
            const siteConfigs = clientData.configs.find((c) => c.site.id === site.id);

            return siteConfigs ? (
              <SiteCard
                actions={
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        downloadAllConfigsForSite(clientData.client.id, site.id);
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      <span className="hidden sm:inline">Download</span>
                      <DocumentArrowDownIcon className="ml-1 size-4" />
                    </Button>
                    <Button
                      onClick={() => {
                        removeFromSite({ clientId: clientData.client.id, siteId: site.id });
                      }}
                      size="sm"
                      variant="destructive"
                    >
                      <span className="hidden sm:inline">Remove</span>
                      <span className="sm:hidden">×</span>
                    </Button>
                  </div>
                }
                isActive={true}
                isInitiallyOpen={site.isDefault}
                key={site.id}
                site={site}
              >
                <ConfigGrid
                  clientName={clientData.client.name}
                  configs={siteConfigs.configs}
                  show={show}
                />
              </SiteCard>
            ) : (
              <SiteCard
                actions={
                  <Button
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
                    onClick={() => {
                      addToSite({ clientId: clientData.client.id, siteId: site.id });
                    }}
                    size="sm"
                    variant="ghost"
                  >
                    Add to site
                  </Button>
                }
                isActive={false}
                key={site.id}
                site={site}
              />
            );
          })}
      </div>
    </>
  );
};

export default ClientDetailPage;
