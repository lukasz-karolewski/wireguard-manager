import { clsx } from "clsx";
import type { FC, ReactNode } from "react";

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode | ReactNode[];
  help?: string;
  label: string;
}

const FormField: FC<FormFieldProps> = ({ children, className, help, label, ...props }) => (
  <div className={clsx("mb-4", className)} {...props}>
    <div className="grid grid-cols-3 items-center gap-x-4">
      <label className="text-right font-bold">{label}</label>
      <div className="col-span-2">{children}</div>
      {help && <p className="col-span-2 col-start-2 text-sm italic text-gray-500">{help}</p>}
    </div>
  </div>
);

export default FormField;
