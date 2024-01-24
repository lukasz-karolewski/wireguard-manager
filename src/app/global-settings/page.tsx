"use client";

import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import FormField from "~/components/ui/form-field";
import { Input } from "~/components/ui/input";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/react";

const GlobalSettingsPage: React.FC = () => {
  const { data: settings, refetch } = api.settings.getAllSettings.useQuery();

  const { mutate, isPending: isPosting } = api.settings.set_wg_network.useMutation({
    onSuccess: (data) => {
      refetch();
      toast.success("saved");
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.value;
      if (errorMessage) toast.error(errorMessage.join(", "));
      else toast.error("Failed to save");
    },
  });

  if (!settings) return <>loading</>;

  return (
    <div>
      <PageHeader title={`Global settings`}></PageHeader>
      <form
        action={(formData: FormData) => {
          mutate({ value: `${formData.get("wg_network")}` });
        }}
        className="bg-slate-200 p-4"
      >
        <FormField
          label="Wireguard network"
          help="/16 network for all sites, each site will get a /24"
        >
          <Input
            type="text"
            id="wg_network"
            name="wg_network"
            defaultValue={settings["wg_network"]}
          />
        </FormField>
        <Button type="submit" disabled={isPosting}>
          Save
        </Button>
      </form>
    </div>
  );
};

export default GlobalSettingsPage;
