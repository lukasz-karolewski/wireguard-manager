import { FC } from "react";

type FormFieldProps = {
  children: React.ReactNode;
  label: string;
  help?: string
};

const FormField: FC<FormFieldProps> = ({ children, label, help }) => (
  <div className="flex flex-col mb-4">
    <label className="mb-2 font-bold text-lg text-gray-900">{label}</label>
    {children}
    <p className="text-gray-500 italic text-sm">{help}</p>
  </div>
);

export default FormField;
