import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import Modal from "~/components/ui/modal";

type Props = {
  // client?: ClientConfig;
};

type FormValues = {
  id: number;
  name: string;
  PrivateKey: string;
  PublicKey: string;
};

const AddClientModal = NiceModal.create<Props>(() => {
  const modal = useModal();

  const { register, handleSubmit, reset, setValue } = useForm<FormValues>({
    // defaultValues: client || {
    //   id: 1,
    // },
  });

  const handleFormSubmit = (data: FormValues) => {
    // const newConfig: GlobalConfig = {
    //   ...config,
    //   servers: config?.servers ? [...config.servers] : [],
    //   clients: config?.clients ? [...config.clients, data] : [data],
    // };
    // apiClient.saveConfig(newConfig).then(() => {
    //   mutate();
    //   modal.remove();
    // });
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
          {/* <FormField label="Name">
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
          </FormField> */}
        </div>
        <div className="flex justify-end gap-4 bg-slate-100 p-4 ">
          {/* <Button type="submit">{client ? "Update" : "Add"}</Button> */}
          <Button type="button" onClick={modal.remove}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export default AddClientModal;
