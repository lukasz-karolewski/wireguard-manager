"use client";

import { toast } from "react-hot-toast";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import FormField from "~/components/ui/form-field";
import { Input } from "~/components/ui/input";
import PageHeader from "~/components/ui/page-header";
import { api } from "~/trpc/react";

const GlobalSettingsPage: React.FC = () => {
  const { data: settings, refetch } = api.settings.getAllSettings.useQuery();

  const { isPending: isPosting, mutate } = api.settings.set_wg_network.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (_data) => {
      refetch();
      toast.success("saved");
    },
  });

  if (!settings) return "loading";

  return (
    <>
      <PageHeader title="Global settings" />
      <div className="container">
        <Card>
          <form
            action={(formData: FormData) => {
              const wgNetwork = formData.get("wg_network");
              if (!wgNetwork || typeof wgNetwork !== "string") {
                toast.error("Network value is required");
                return;
              }
              mutate({ value: wgNetwork });
            }}
            className="space-y-4"
          >
            <FormField help="/16 network for all sites, each site will get a /24" label="Wireguard network">
              <Input defaultValue={settings.wg_network} id="wg_network" name="wg_network" type="text" />
            </FormField>
            <Button disabled={isPosting} type="submit">
              Save
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default GlobalSettingsPage;
