import NiceModal, { useModal } from "@ebay/nice-modal-react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { Button } from "~/components/ui/button";
import Modal from "~/components/ui/modal";
import { Client } from "~/generated/prisma/client";
import { api } from "~/trpc/react";
import { RouterInputs } from "~/trpc/shared";
import { zodErrorsToString } from "~/utils";

import FormField from "../ui/form-field";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

type FormValues = RouterInputs["client"]["create"];

interface Props {
  client?: RouterInputs["client"]["update"];
}

export function mapClientForEdit(client: Client): RouterInputs["client"]["update"] {
  return {
    email: client.email ?? undefined,
    id: client.id,
    name: client.name,
    ownerId: client.ownerId ?? undefined,
    private_key: client.privateKey,
  };
}

export const AddEditClientModal = NiceModal.create<Props>(({ client }) => {
  const modal = useModal();
  const isAdd = !client;

  // Fetch all users for owner selection
  const { data: users } = api.user.getAllUsers.useQuery();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormValues>({
    defaultValues: isAdd ? {} : { ...client },
  });

  const options = {
    onError: (error: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const errorMessage = zodErrorsToString(error);
      if (errorMessage) toast.error(errorMessage);
      else toast.error("Failed to save");
    },
    onSuccess: (_data: any) => {
      toast.success("Saved");
      modal.resolve();
      modal.remove();
    },
  };

  const { mutate: create } = api.client.create.useMutation(options);
  const { mutate: update } = api.client.update.useMutation(options);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    data.siteIds = data.siteIds?.map(Number);
    if (isAdd) {
      create(data);
    } else {
      update({ id: client.id, ...data });
    }
  };

  return (
    <Modal
      className="md:w-1/2"
      onClose={() => {
        modal.remove();
      }}
      open={modal.visible}
      title={isAdd ? "New Client" : "Edit Client"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4">
          <FormField
            help="Recommending <username>-<device type> i.e. john-iphone, but can be anything"
            label="Name"
          >
            <Input type="text" {...register("name", { required: true })} />
          </FormField>
          <FormField help="Select the user who will own this client" label="Owner">
            <Select {...register("ownerId")}>
              <option value="">Default (Current User)</option>
              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name ?? user.email}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Private key">
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
          <Button onClick={modal.remove} type="button" variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
});
