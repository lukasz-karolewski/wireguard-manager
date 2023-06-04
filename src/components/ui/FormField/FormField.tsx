import { FC } from "react";

type FormFieldProps = {
  children: React.ReactNode;
  label: string;
};

const FormField: FC<FormFieldProps> = ({ children, label }) => (
  <div className="flex flex-col mb-4">
    <label className="mb-2 font-bold text-lg text-gray-900">{label}</label>
    {children}
  </div>
);

export default FormField;
