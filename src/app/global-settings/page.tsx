"use client";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

const GlobalSettingsPage: React.FC = () => {
  const { data: settings, refetch } = api.settings.getAllSettings.useQuery();

  const { mutate, isLoading: isPosting } = api.settings.set_wg_network.useMutation({
    onSuccess: (data) => refetch(),
  });

  if (!settings) return <>loading</>;

  return (
    <div>
      <form
        action={(formData: FormData) => {
          mutate({ value: `${formData.get("wg_network")}` });
        }}
        className="bg-slate-200 p-4"
      >
        <fieldset className="flex flex-row items-center gap-2">
          <label htmlFor="wg_network">network</label>
          <input
            type="text"
            id="wg_network"
            name="wg_network"
            defaultValue={settings["wg_network"]}
          />
        </fieldset>
        <Button type="submit" disabled={isPosting}>
          save
        </Button>
      </form>
    </div>
  );
};

export default GlobalSettingsPage;
