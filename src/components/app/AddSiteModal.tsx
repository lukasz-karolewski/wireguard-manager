"use client";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RouterInputs } from "~/trpc/shared";

import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import FormField from "../ui/form-field";
import { Input } from "../ui/input";
import Modal from "../ui/modal";

type FormValues = RouterInputs["site"]["create"];

const AddSiteModal = NiceModal.create(() => {
  const modal = useModal();
  const { mutate } = api.site.create.useMutation({
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

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      config_path: "/etc/wireguard/wg0.conf",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data, event) => {
    console.log(data, event);
    mutate(data);
  };

  return (
    <Modal
      open={modal.visible}
      onClose={() => {
        modal.remove();
      }}
      title="Add Site"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-80 p-4">
          <FormField label="Site ID">
            <Input type="number" {...register("id", { required: true, valueAsNumber: true })} />
          </FormField>

          <FormField label="Name">
            <Input type="text" {...register("name", { required: true })} />
          </FormField>

          <FormField label="Endpoint">
            <Input {...register("endpointAddress", { required: true })} />
          </FormField>

          <FormField label="DNS address">
            <Input {...register("dns", { required: false })} />
          </FormField>

          <FormField label="Pihole address">
            <Input {...register("dns_pihole", { required: false })} />
          </FormField>

          <FormField label="Config Path">
            <Input {...register("config_path", { required: false })} />
          </FormField>
        </div>
        <div className="flex justify-end gap-4 bg-slate-100 p-4 ">
          <Button type="submit">{"Add"}</Button>
          <Button type="button" onClick={modal.remove}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export default AddSiteModal;
