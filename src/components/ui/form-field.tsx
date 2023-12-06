import { FC, ReactElement } from "react";

type FormFieldProps = {
  children: ReactElement<{ id: string }>;
  label: string;
  help?: string;
};

const FormField: FC<FormFieldProps> = ({ children, label, help }) => (
  <div className="mb-4">
    <div className="grid grid-cols-3 items-center gap-x-4">
      <label className="text-right font-bold">{label}</label>
      <div className="col-span-2">{children}</div>
      {help && <p className="col-span-2 col-start-2 text-sm italic text-gray-500">{help}</p>}
    </div>
  </div>
);

export default FormField;
