import { useForm } from "react-hook-form";
import { Button, FormField, FormRadioButton, Input } from "~/components/ui";
import { useConfig } from "~/providers/configProvider";
import { ClientConfig } from "~/types";
import apiClient from "~/utils/apiClient";

type Props = {
  client?: ClientConfig;
  onSubmit: (data: ClientConfig) => void;
};

type FormValues = ClientConfig;

export default function EditClientForm({ client, onSubmit }: Props) {
  const { config } = useConfig();

  apiClient.getNewKeyPair().then((keys) => {
    setValue("PrivateKey", keys.private_key);
    setValue("PublicKey", keys.public_key);
  });

  const { register, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: client || {
      id: 1,
    },
  });

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-slate-100 p-4 ">
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
      
      <Button type="submit">{client ? "Update" : "Add"}</Button>
    </form>
  );
}
