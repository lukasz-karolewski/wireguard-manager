import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useForm } from "react-hook-form";
import useSwr from "swr";
import { Button, FormField, Input, Modal } from "~/components/ui";
import { ClientConfig, GlobalConfig } from "~/types";
import apiClient from "~/utils/apiClient";

type Props = {
  client?: ClientConfig;
};

type FormValues = ClientConfig;

const AddClientModal = NiceModal.create<Props>(({ client }) => {
  const modal = useModal();
  const { data: config, isLoading, mutate } = useSwr<GlobalConfig>("/api/loadConfig");
  if (!config) return <></>;

  const { register, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: client || {
      id: 1,
    },
  });

  apiClient.getNewKeyPair().then((keys) => {
    setValue("PrivateKey", keys.private_key);
    setValue("PublicKey", keys.public_key);
  });

  const handleFormSubmit = (data: FormValues) => {
    const newConfig: GlobalConfig = {
      ...config,
      servers: config?.servers ? [...config.servers] : [],
      clients: config?.clients ? [...config.clients, data] : [data],
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
      title="Add Client"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="min-w-[600px]">
        <div className="p-4">
          <FormField label="Name">
            <Input name="name" register={register} />
          </FormField>

          <FormField label="Id">
            <Input name="id" register={register} />
          </FormField>

          <FormField label="PrivateKey">
            <Input name="PrivateKey" register={register} />
          </FormField>

          <FormField label="PublicKey">
            <Input name="PublicKey" register={register} />
          </FormField>
        </div>
        <div className="flex justify-end gap-4 bg-slate-100 p-4 ">
          <Button type="submit">{client ? "Update" : "Add"}</Button>
          <Button type="button" onClick={modal.remove}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export default AddClientModal;
