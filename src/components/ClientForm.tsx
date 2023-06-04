import { useForm } from "react-hook-form";
import { Button, FormField, FormRadioButton, Input } from "~/components/ui";
import { ClientConfig } from "~/types";

type Props = {
  client?: ClientConfig;
  onSubmit: (data: ClientConfig) => void;
};

type FormValues = ClientConfig;

export default function EditClientForm({ client, onSubmit }: Props) {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: client || {},
  });

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-slate-100 p-4 ">
      <FormField label="Name">
        <Input name="name" register={register} />
      </FormField>

      <FormField label="Mode">
        <FormRadioButton
          name="mode"
          value="localOnly"
          label="Local only traffic"
          register={register}
        />
        <FormRadioButton
          name="mode"
          value="allTraffic"
          label="Redirect all traffic"
          register={register}
        />
      </FormField>

      <div className="border p-4 mb-4 bg-white">
        <h2 className="text-xl font-bold mb-4">Interface</h2>
        <p className="-mt-4 mb-4 text-sm text-gray-500 italic">
          used to configure Interface on the client device
        </p>

        <FormField label="Address">
          <Input name="for_server.Address" register={register} />
        </FormField>

        <FormField label="DNS">
          <Input name="for_server.DNS" register={register} />
        </FormField>

        <FormField label="PrivateKey">
          <Input name="for_server.PrivateKey" register={register} />
        </FormField>
      </div>

      <Button type="submit">{client ? "Update" : "Add"}</Button>
    </form>
  );
}
