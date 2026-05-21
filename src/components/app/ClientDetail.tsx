"use client";

import NiceModal from "@ebay/nice-modal-react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { type FC, useState } from "react";

import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";
import { downloadAllConfigsForSite, formatDateWithTime } from "~/utils";
import { Button } from "../ui/button";
import { InfoCard } from "../ui/info-card";
import PageHeader from "../ui/page-header";
import { AddEditClientModal, mapClientForEdit } from "./AddEditClientModal";
import { ConfigGrid } from "./ConfigGrid";
import { SiteCard } from "./SiteCard";

interface ClientDetailProps {
  clientData: RouterOutputs["client"]["get"];
  sites: RouterOutputs["site"]["getAll"];
}

export const ClientDetail: FC<ClientDetailProps> = ({ clientData, sites }) => {
  const router = useRouter();
  const [show, setShowConfig] = useState<"config" | "qr">("qr");

  const refresh = () => {
    router.refresh();
  };

  const { mutate: disableClient } = api.client.disable.useMutation({ onSuccess: refresh });
  const { mutate: enableClient } = api.client.enable.useMutation({ onSuccess: refresh });
  const { mutate: addToSite } = api.client.addToSite.useMutation({ onSuccess: refresh });
  const { mutate: removeFromSite } = api.client.removeFromSite.useMutation({ onSuccess: refresh });

  async function onEdit() {
    await NiceModal.show(AddEditClientModal, {
      client: mapClientForEdit(clientData.client),
    });
    router.refresh();
  }

  return (
    <>
      <PageHeader parent="Clients" parentHref="/" title={clientData.client.name}>
        {clientData.client.enabled && (
          <Button
            className="hidden md:block"
            onClick={() => {
              setShowConfig(show === "qr" ? "config" : "qr");
            }}
            variant="ghost"
          >
            {show === "qr" ? "Show configs" : "Show QR codes"}
          </Button>
        )}
        <Button onClick={onEdit} variant="ghost">
          Edit
        </Button>
        {clientData.client.enabled && (
          <Button
            className="hidden md:block"
            onClick={() => {
              disableClient({ id: clientData.client.id });
            }}
            variant="ghost"
          >
            Disable
          </Button>
        )}
        {!clientData.client.enabled && (
          <Button
            className="hidden md:block"
            onClick={() => {
              enableClient({ id: clientData.client.id });
            }}
            variant="default"
          >
            Enable
          </Button>
        )}
      </PageHeader>

      <div className="mb-8">
        <InfoCard
          items={[
            {
              label: "Created",
              value: formatDateWithTime(clientData.client.createdAt),
            },
            {
              label: "Created By",
              value: `${clientData.client.createdBy.name} (${clientData.client.createdBy.email})`,
            },
            {
              label: "Last Updated",
              value: formatDateWithTime(clientData.client.updatedAt),
            },
          ]}
        />
      </div>

      {clientData.client.enabled && (
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-medium text-gray-900">Sites</h3>
          {[...sites]
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
                        <DocumentArrowDownIcon className="ml-1 size-4" />
                        <span className="hidden sm:inline">Download configs</span>
                      </Button>
                      <Button
                        onClick={() => {
                          removeFromSite({ clientId: clientData.client.id, siteId: site.id });
                        }}
                        size="sm"
                        variant="secondary"
                      >
                        <span className="hidden sm:inline">Disable</span>
                        <span className="sm:hidden">×</span>
                      </Button>
                    </div>
                  }
                  isActive={true}
                  isInitiallyOpen={false}
                  key={site.id}
                  site={site}
                >
                  <ConfigGrid clientName={clientData.client.name} configs={siteConfigs.configs} show={show} />
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
      )}
    </>
  );
};
