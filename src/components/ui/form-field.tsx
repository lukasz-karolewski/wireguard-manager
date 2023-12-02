import { FC, ReactElement } from "react";

type FormFieldProps = {
  children: ReactElement<{ id: string }>;
  label: string;
  help?: string;
};

const FormField: FC<FormFieldProps> = ({ children, label, help }) => (
  <div className="mb-4 flex flex-col">
    <label className="mb-2 text-lg font-bold">{label}</label>
    {children}
    <p className="text-sm italic text-gray-500">{help}</p>
  </div>
);

export default FormField;
