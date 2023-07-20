import { FC } from "react";

type FormFieldProps = {
  children: React.ReactNode;
  label: string;
  help?: string;
};

const FormField: FC<FormFieldProps> = ({ children, label, help }) => (
  <div className="mb-4 flex flex-col">
    <label className="mb-2 text-lg font-bold text-gray-900">{label}</label>
    {children}
    <p className="text-sm italic text-gray-500">{help}</p>
  </div>
);

export default FormField;
