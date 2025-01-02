"use client";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Site } from "@prisma/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { api } from "~/trpc/react";
import { RouterInputs } from "~/trpc/shared";
import { zodErrorsToString } from "~/utils";

import { Button } from "../ui/button";
import FormField from "../ui/form-field";
import { Input } from "../ui/input";
import Modal from "../ui/modal";
import { Textarea } from "../ui/textarea";

type FormValues = RouterInputs["site"]["create"];

interface Props {
  site?: RouterInputs["site"]["update"];
}

export function mapSiteForEdit(site: Site): RouterInputs["site"]["update"] {
  return {
    config_path: site.configPath,
    dns: site.DNS ?? undefined,
    dns_pihole: site.piholeDNS ?? undefined,
    endpointAddress: site.endpointAddress,
    id: site.id,
    listenPort: site.listenPort,
    localAddresses: site.localAddresses,
    name: site.name,
    postDown: site.postDown ?? undefined,
    postUp: site.postUp ?? undefined,
    private_key: site.privateKey ?? undefined,
    public_key: site.publicKey,
  };
}

export const AddEditSiteModal = NiceModal.create<Props>(({ site }) => {
  const modal = useModal();
  const isAdd = !site;

  const { handleSubmit, register } = useForm<FormValues>({
    defaultValues: isAdd
      ? { config_path: "/etc/wireguard/wg0.conf", listenPort: 51_820 }
      : {
          ...site,
        },
  });

  const options = {
    onError: (error: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const errorMessage = zodErrorsToString(error);
      if (errorMessage) toast.error(errorMessage);
      else toast.error("Failed to save");
    },
    onSuccess: () => {
      toast.success("saved");
      modal.resolve();
      modal.remove();
    },
  };
  const { mutate: create } = api.site.create.useMutation(options);
  const { mutate: update } = api.site.update.useMutation(options);

  const onSubmit: SubmitHandler<FormValues> = (data, _event) => {
    if (isAdd) {
      create(data);
    } else {
      update(data);
    }
  };

  return (
    <Modal
      className="w-2/3"
      onClose={() => {
        modal.remove();
      }}
      open={modal.visible}
      title={isAdd ? "Add Site" : "Edit Site"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 p-4">
          <div className="border border-gray-300">
            <h3 className="bg-accent p-4 text-white">Interface</h3>
            <div className="p-4">
              <FormField label="Name">
                <Input type="text" {...register("name", { required: true })} />
              </FormField>

              <FormField help="Used to assign a /24 network " label="Site Id">
                <Input
                  disabled={!isAdd}
                  max={255}
                  min={1}
                  type="number"
                  {...register("id", { max: 255, min: 1, required: true, valueAsNumber: true })}
                />
              </FormField>

              <FormField label="Listen Port">
                <Input
                  type="number"
                  {...register("listenPort", {
                    max: 65_535,
                    min: 1024,
                    required: false,
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

              <FormField label="Public Key">
                <Input
                  placeholder="leave empty to generate key"
                  {...register("public_key", { required: false })}
                />
              </FormField>

              <FormField help="Each line will be separate PostUp command" label="Post Up script">
                <Textarea {...register("postUp", { required: false })} />
              </FormField>

              <FormField help="Each line will be separate PostUp command" label="Post Down script">
                <Textarea {...register("postDown", { required: false })} />
              </FormField>
            </div>
          </div>
          <div className="border border-gray-300">
            <h3 className="bg-accent p-4 text-white">Peer options</h3>
            <div className="p-4">
              <FormField
                help="External IP or DNS with port where clients should connect"
                label="Endpoint"
              >
                <Input {...register("endpointAddress", { required: true })} />
              </FormField>
              <FormField
                help="Comma separated local networks in CIDR notation to expose to other sites, and clients"
                label="Local Networks"
              >
                <Input {...register("localAddresses", { required: false })} />
              </FormField>

              <FormField help="local DNS server clients can use" label="DNS IP">
                <Input {...register("dns", { required: false })} />
              </FormField>

              <FormField help="local Pihole instance clients can use" label="Pihole IP">
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
                help="Clients will display config for this site by default"
                label="Mark as Default Site"
              >
                <Input
                  className="w-4"
                  type="checkbox"
                  {...register("markAsDefault", { required: false })}
                />
              </FormField>
            </div>
          </div>
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
