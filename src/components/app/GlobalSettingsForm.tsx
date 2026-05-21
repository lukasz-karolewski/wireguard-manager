"use client";

import { useRouter } from "next/navigation";
import type { FC } from "react";
import { toast } from "react-hot-toast";

import { Button } from "~/components/ui/button";
import FormField from "~/components/ui/form-field";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";

interface GlobalSettingsFormProps {
  settings: RouterOutputs["settings"]["getAllSettings"];
}

export const GlobalSettingsForm: FC<GlobalSettingsFormProps> = ({ settings }) => {
  const router = useRouter();

  const { isPending: isPosting, mutate } = api.settings.set_wg_network.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      router.refresh();
      toast.success("saved");
    },
  });

  return (
    <form
      action={(formData: FormData) => {
        const wgNetwork = formData.get("wg_network");
        if (!wgNetwork || typeof wgNetwork !== "string") {
          toast.error("Network value is required");
          return;
        }
        mutate({ value: wgNetwork });
      }}
      className="flex flex-col gap-4"
    >
      <FormField help="/16 network for all sites, each site will get a /24" label="Wireguard network">
        <Input defaultValue={settings.wg_network} id="wg_network" name="wg_network" type="text" />
      </FormField>
      <Button disabled={isPosting} type="submit">
        Save
      </Button>
    </form>
  );
};
