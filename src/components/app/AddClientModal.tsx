import NiceModal, { useModal } from "@ebay/nice-modal-react";

import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import Modal from "~/components/ui/modal";
import { api } from "~/trpc/react";
import { RouterInputs } from "~/trpc/shared";
import FormField from "../ui/form-field";
import { Input } from "../ui/input";

interface Props {}

type FormValues = RouterInputs["client"]["create"];

const AddClientModal = NiceModal.create<Props>(() => {
  const modal = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {},
  });

  const { mutate } = api.client.create.useMutation({
    onSuccess: (data) => {
      toast.success("saved");
      modal.resolve();
      modal.remove();
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.value;
      if (errorMessage) toast.error(errorMessage.join(", "));
      else toast.error("Failed to save");
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data, event) => {
    Object.keys(data).forEach((key) => {
      if (!data[key as keyof typeof data]) {
        delete data[key as keyof typeof data];
      }
    });
    mutate(data);
  };

  return (
    <Modal
      open={modal.visible}
      onClose={() => {
        modal.remove();
      }}
      title="Add Client"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="min-w-[600px]">
        <div className="p-4">
          <FormField label="Name">
            <Input type="text" {...register("name", { required: true })} />
          </FormField>
          <FormField label="Email">
            <>
              <Input type="email" {...register("email", { required: false })} />
              {errors.email && <span>{errors.email.message}</span>}
            </>
          </FormField>
        </div>
        <div className="flex justify-end gap-4 bg-slate-100 p-4 ">
          <Button type="submit">Add</Button>
          <Button type="button" onClick={modal.remove}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export default AddClientModal;
