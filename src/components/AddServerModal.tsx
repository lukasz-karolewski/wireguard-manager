import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useForm } from "react-hook-form";
import useSwr from "swr";
import { Button, FormField, FormRadioButton, Input, Modal } from "~/components/ui";
import { GlobalConfig, ServerConfig } from "~/types";
import apiClient from "~/utils/apiClient";
import { get_new_site_address } from "~/utils/common";

type Props = {
  server?: ServerConfig;
};

type FormValues = ServerConfig;

const AddServerModal = NiceModal.create<Props>(({ server }) => {
  const modal = useModal();
  const { data: config, isLoading, mutate } = useSwr<GlobalConfig>("/api/loadConfig");
  if (!config) return <></>;
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: server || {
      mode: "native",
      deployment: "file",
      deployment_target: "wg0.conf",
      for_server: { Address: get_new_site_address(config), MTU: 1420, ListenPort: 51820 },
    },
  });
  apiClient.getNewKeyPair().then((keys) => {
    setValue("for_server.PrivateKey", keys.private_key);
    setValue("for_client.PublicKey", keys.public_key);
  });
  const handleFormSubmit = (data: FormValues) => {
    const newServer: ServerConfig = {
      name: data.name,
      mode: data.mode,
      deployment: "file",
      deployment_target: "wg0.conf",
      for_server: {
        ...data.for_server,
      },
      for_client: {
        ...data.for_client,
      },
    };
    const newConfig: GlobalConfig = {
      ...config,
      servers: [...config.servers, newServer],
      clients: [...config.clients],
    };

    apiClient.saveConfig(newConfig).then(() => {
      mutate();
      modal.remove();
    });
  };

  return (
    <Modal
      open={modal.visible}
      onClose={() => {
        modal.remove();
      }}
      title="Add Server"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="p-4">
          <FormField label="Name">
            <Input name="name" register={register} />
          </FormField>
          <FormField label="Mode">
            <FormRadioButton name="mode" value="native" label="Native" register={register} />
            <FormRadioButton
              name="mode"
              value="edgerouter"
              label="EdgeRouter"
              register={register}
            />
          </FormField>
          <FormField label="Deployment">
            <FormRadioButton name="deployment" value="file" label="File" register={register} />
            <FormRadioButton name="deployment" value="scp" label="scp" register={register} />
            <FormRadioButton name="deployment" value="ssh" label="ssh" register={register} />
          </FormField>
          <FormField label="Deployment Target">
            <Input name="deployment_target" register={register} />
          </FormField>
          <div className="mb-4 border bg-white p-4">
            <h2 className="mb-4 text-xl font-bold">Interface</h2>
            <p className="-mt-4 mb-4 text-sm italic text-gray-500">Configure server Interface</p>
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
          <div className="mb-4 border  bg-white p-4">
            <h2 className="mb-4 text-xl font-bold">Peer</h2>
            <p className="-mt-4 mb-4 text-sm italic text-gray-500">
              For other servers to configure site-to-site
            </p>
            <FormField label="Endpoint" help="DNS entry pointing to this site">
              <Input name="for_client.Endpoint" register={register} />
            </FormField>
            <FormField
              label="AllowedIPs"
              help="Comma separated local networks at this site that should be accessible from other sites. Typically 192.168.10.0/24, 192.168.11.0/24"
            >
              <Input name="for_client.AllowedIPs" register={register} />
            </FormField>
            <FormField label="PublicKey">
              <Input name="for_client.PublicKey" register={register} />
            </FormField>
          </div>
        </div>
        <div className="flex justify-end gap-4 bg-slate-100 p-4 ">
          <Button type="submit">{server ? "Update" : "Add"}</Button>
          <Button type="button" onClick={modal.remove}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export default AddServerModal;
