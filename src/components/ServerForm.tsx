import { Button, FormField, FormRadioButton, Input } from "~/components/ui";
import { ServerConfig } from "~/types";
import { useForm } from "react-hook-form";
import apiClient from "~/utils/apiClient";
import { useConfig } from "~/providers/configProvider";
import { get_new_site_address } from "~/utils/common";

import useSwr from "swr";
import { GlobalConfig } from "~/types";

type Props = {
  server?: ServerConfig;
  onSubmit: (data: ServerConfig) => void;
};

type FormValues = ServerConfig;

export default function EditServerForm({ server, onSubmit }: Props) {
  const { data: config, isLoading } = useSwr<GlobalConfig>("/api/loadConfig");
  if (!config) return <></>

  apiClient.getNewKeyPair().then((keys) => {
    setValue("for_server.PrivateKey", keys.private_key);
    setValue("for_client.PublicKey", keys.public_key);
  });

  const { register, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: server || {
      mode: "native",

      deployment: "file",
      deployment_target: "wg0.conf",
      for_server: { Address: get_new_site_address(config), MTU: 1420, ListenPort: 51820 },
    },
  });

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-slate-100 p-4 ">
      <FormField label="Name">
        <Input name="name" register={register} />
      </FormField>

      <FormField label="Mode">
        <FormRadioButton name="mode" value="native" label="Native" register={register} />
        <FormRadioButton name="mode" value="edgerouter" label="EdgeRouter" register={register} />
      </FormField>

      <FormField label="Deployment">
        <FormRadioButton name="deployment" value="file" label="File" register={register} />
        <FormRadioButton name="deployment" value="scp" label="scp" register={register} />
        <FormRadioButton name="deployment" value="ssh" label="ssh" register={register} />
      </FormField>

      <FormField label="Deployment Target">
        <Input name="deployment_target" register={register} />
      </FormField>

      <div className="border p-4 mb-4 bg-white">
        <h2 className="text-xl font-bold mb-4">Interface</h2>
        <p className="-mt-4 mb-4 text-sm text-gray-500 italic">Configure server Interface</p>

        <FormField label="Address">
          <Input name="for_server.Address" register={register} />
        </FormField>

        <FormField label="ListenPort">
          <Input name="for_server.ListenPort" register={register} />
        </FormField>

        <FormField label="MTU">
          <Input name="for_server.MTU" register={register} />
        </FormField>

        <FormField label="PrivateKey">
          <Input name="for_server.PrivateKey" register={register} />
        </FormField>
      </div>

      <div className="border p-4  mb-4 bg-white">
        <h2 className="text-xl font-bold mb-4">Peer</h2>
        <p className="-mt-4 mb-4 text-sm text-gray-500 italic">
          For other servers to configure site-to-site
        </p>
        <FormField label="Endpoint" help="DNS entry pointing to this site">
          <Input name="for_client.Endpoint" register={register} />
        </FormField>
        <FormField label="AllowedIPs" help="Comma separated local networks at this site that should be accessible from other sites. Typically 192.168.10.0/24, 192.168.11.0/24">
          <Input name="for_client.AllowedIPs" register={register} />
        </FormField>
        <FormField label="PublicKey">
          <Input name="for_client.PublicKey" register={register} />
        </FormField>
      </div>

      <Button type="submit">{server ? "Update" : "Add"}</Button>
    </form>
  );
}
