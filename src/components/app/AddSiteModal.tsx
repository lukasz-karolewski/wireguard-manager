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
      listenPort: 51820,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data, event) => {
    mutate(data);
  };

  return (
    <Modal
      open={modal.visible}
      onClose={() => {
        modal.remove();
      }}
      title="Add Site"
      className="w-1/2"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4">
          <FormField label="Name">
            <Input type="text" {...register("name", { required: true })} />
          </FormField>

          <FormField label="Site ID" help="Used to assign a /24 network ">
            <Input
              type="number"
              min={1}
              max={255}
              {...register("id", { required: true, valueAsNumber: true, min: 1, max: 255 })}
            />
          </FormField>

          <FormField label="Endpoint" help="External ip or DNS">
            <Input {...register("endpointAddress", { required: true })} />
          </FormField>

          <FormField
            label="Local Networks"
            help="Local networks to expose to other sites, and clients"
          >
            <Input {...register("endpointAddress", { required: true })} />
          </FormField>

          <FormField label="DNS address" help="optional, can be used by clients">
            <Input {...register("dns", { required: false })} />
          </FormField>

          <FormField label="Pihole address" help="optional, can be used by clients">
            <Input {...register("dns_pihole", { required: false })} />
          </FormField>

          <FormField label="Config Path">
            <Input {...register("config_path", { required: false })} />
          </FormField>

          <FormField label="Listen Port">
            <Input
              type="number"
              {...register("listenPort", { required: false, min: 1024, max: 65535 })}
            />
          </FormField>

          <FormField label="Post Up script">
            <Input {...register("postUp", { required: false })} />
          </FormField>

          <FormField label="Post Down script">
            <Input {...register("postDown", { required: false })} />
          </FormField>

          <FormField
            label="Mark as Default Site"
            help="Clients will display config for this site by default"
          >
            <Input
              type="checkbox"
              className="w-4"
              {...register("markAsDefault", { required: false })}
            />
          </FormField>
        </div>
        <div className="flex justify-end gap-4 bg-slate-100 p-4 ">
          <Button type="submit">{"Add"}</Button>
          <Button type="button" variant="secondary" onClick={modal.remove}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export default AddSiteModal;
