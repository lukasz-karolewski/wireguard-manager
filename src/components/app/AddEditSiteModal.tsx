"use client";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RouterInputs } from "~/trpc/shared";

import { Site } from "@prisma/client";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import FormField from "../ui/form-field";
import { Input } from "../ui/input";
import Modal from "../ui/modal";

interface Props {
  site?: RouterInputs["site"]["update"];
}

type FormValues = RouterInputs["site"]["create"];

export function mapSiteForEdit(site: Site): RouterInputs["site"]["update"] {
  return {
    name: site.name ?? undefined,
    id: site.id,
    endpointAddress: site.endpointAddress ?? undefined,
    localAddresses: site.localAddresses ?? undefined,
    dns: site.DNS ?? undefined,
    dns_pihole: site.PiholeDNS ?? undefined,
    config_path: site.ConfigPath ?? undefined,
    listenPort: site.listenPort ?? undefined,
    postUp: site.postUp ?? undefined,
    postDown: site.postDown ?? undefined,
    private_key: site.PrivateKey ?? undefined,
  };
}

export const AddEditSiteModal = NiceModal.create<Props>(({ site }) => {
  const modal = useModal();
  const isAdd = !site;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: isAdd
      ? { config_path: "/etc/wireguard/wg0.conf", listenPort: 51820 }
      : {
          ...site,
        },
  });

  const options = {
    onSuccess: (data: any) => {
      toast.success("saved");
      modal.resolve();
      modal.remove();
    },
    onError: (error: any) => {
      const errorMessage = error.data?.zodError?.fieldErrors.value;
      if (errorMessage) toast.error(errorMessage.join(", "));
      else toast.error("Failed to save");
    },
  };
  const { mutate: create } = api.site.create.useMutation(options);
  const { mutate: update } = api.site.update.useMutation(options);

  const onSubmit: SubmitHandler<FormValues> = (data, event) => {
    if (isAdd) {
      create(data);
    } else {
      update(data);
    }
  };

  return (
    <Modal
      open={modal.visible}
      onClose={() => {
        modal.remove();
      }}
      title={isAdd ? "Add Site" : "Edit Site"}
      className="w-2/3"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 p-4">
          <div className="border border-gray-300">
            <h3 className="bg-accent p-4 text-white">Interface</h3>
            <div className="p-4">
              <FormField label="Name">
                <Input type="text" {...register("name", { required: true })} />
              </FormField>

              <FormField label="Site Id" help="Used to assign a /24 network ">
                <Input
                  type="number"
                  min={1}
                  max={255}
                  disabled={!isAdd}
                  {...register("id", { required: true, valueAsNumber: true, min: 1, max: 255 })}
                />
              </FormField>

              <FormField label="Listen Port">
                <Input
                  type="number"
                  {...register("listenPort", {
                    required: false,
                    min: 1024,
                    max: 65535,
                    valueAsNumber: true,
                  })}
                />
              </FormField>

              <FormField label="Private Key">
                <Input
                  placeholder="leave empty to generate key"
                  {...register("private_key", { required: false })}
                />
              </FormField>

              <FormField label="Post Up script">
                <Input {...register("postUp", { required: false })} />
              </FormField>

              <FormField label="Post Down script">
                <Input {...register("postDown", { required: false })} />
              </FormField>
            </div>
          </div>
          <div className="border border-gray-300">
            <h3 className="bg-accent p-4 text-white">Peer options</h3>
            <div className="p-4">
              <FormField label="Endpoint" help="External IP or DNS where should clients connect">
                <Input {...register("endpointAddress", { required: true })} />
              </FormField>
              <FormField
                label="Local Networks"
                help="Local networks to expose to other sites, and clients"
              >
                <Input {...register("localAddresses", { required: false })} />
              </FormField>

              <FormField label="DNS IP" help="optional, can be used by clients">
                <Input {...register("dns", { required: false })} />
              </FormField>

              <FormField label="Pihole IP" help="optional, can be used by clients">
                <Input {...register("dns_pihole", { required: false })} />
              </FormField>
            </div>
          </div>
          <div className="border border-gray-300">
            <h3 className="bg-accent p-4 text-white">App options</h3>
            <div className="p-4">
              <FormField label="Config Path">
                <Input {...register("config_path", { required: false })} />
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
          </div>
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
