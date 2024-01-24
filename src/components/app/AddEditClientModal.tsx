import NiceModal, { useModal } from "@ebay/nice-modal-react";

import { Client } from "@prisma/client";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import Modal from "~/components/ui/modal";
import { api } from "~/trpc/react";
import { RouterInputs } from "~/trpc/shared";
import { zodErrorsToString } from "~/utils";
import FormField from "../ui/form-field";
import { Input } from "../ui/input";

interface Props {
  client?: RouterInputs["client"]["update"];
}

type FormValues = RouterInputs["client"]["create"];

export function mapClientForEdit(client: Client): RouterInputs["client"]["update"] {
  return {
    id: client.id,
    name: client.name ?? undefined,
    email: client.email ?? undefined,
    private_key: client.privateKey ?? undefined,
  };
}

export const AddEditClientModal = NiceModal.create<Props>(({ client }) => {
  const modal = useModal();
  const isAdd = !client;

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    defaultValues: isAdd ? {} : { ...client },
  });

  const options = {
    onSuccess: (data: any) => {
      toast.success("Saved");
      modal.resolve();
      modal.remove();
    },
    onError: (error: any) => {
      const errorMessage = zodErrorsToString(error);
      if (errorMessage) toast.error(errorMessage);
      else toast.error("Failed to save");
    },
  };

  const { mutate: create } = api.client.create.useMutation(options);
  const { mutate: update } = api.client.update.useMutation(options);

  const onSubmit: SubmitHandler<FormValues> = (data, event) => {
    if (isAdd) {
      return create(data);
    } else {
      return update({ id: client.id, ...data });
    }
  };

  return (
    <Modal
      open={modal.visible}
      onClose={() => {
        modal.remove();
      }}
      title={isAdd ? "New Client" : "Edit Client"}
      className="md:w-1/2"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <FormField label="Private key" className="bg-red-300 p-4">
            <>
              <Input
                placeholder="optional, leave empty to autogenerate"
                {...register("private_key", { required: false })}
              />
              {errors.private_key && <span>{errors.private_key.message}</span>}
            </>
          </FormField>
        </div>
        <div className="flex justify-end gap-4 bg-slate-100 p-4 ">
          <Button type="submit">{isAdd ? "Add" : "Save"}</Button>
          <Button type="button" variant="secondary" onClick={modal.remove}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
});
