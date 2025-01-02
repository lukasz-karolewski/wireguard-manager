"use client";

import { toast } from "react-hot-toast";

import { Button } from "~/components/ui/button";
import FormField from "~/components/ui/form-field";
import { Input } from "~/components/ui/input";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/react";

const GlobalSettingsPage: React.FC = () => {
  const { data: settings, refetch } = api.settings.getAllSettings.useQuery();

  const { isPending: isPosting, mutate } = api.settings.set_wg_network.useMutation({
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.value;
      if (errorMessage) toast.error(errorMessage.join(", "));
      else toast.error("Failed to save");
    },
    onSuccess: (_data) => {
      refetch();
      toast.success("saved");
    },
  });

  if (!settings) return <>loading</>;

  return (
    <>
      <PageHeader title={`Global settings`}></PageHeader>
      <form
        action={(formData: FormData) => {
          const wgNetwork = formData.get("wg_network");

          // Type guard to ensure we have a string value
          if (!wgNetwork || typeof wgNetwork !== "string") {
            toast.error("Network value is required");
            return;
          }

          // Now TypeScript knows wgNetwork is a string
          mutate({ value: wgNetwork });
        }}
        className="bg-slate-200 p-4"
      >
        <FormField
          help="/16 network for all sites, each site will get a /24"
          label="Wireguard network"
        >
          <Input
            defaultValue={settings.wg_network}
            id="wg_network"
            name="wg_network"
            type="text"
          />
        </FormField>
        <Button disabled={isPosting} type="submit">
          Save
        </Button>
      </form>
    </>
  );
};

export default GlobalSettingsPage;
