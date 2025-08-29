import { useId } from "react";

interface FormRadioButtonProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
  name: string;
  register: any;
  value: string;
}

const FormRadioButton = ({ label, name, register, value }: FormRadioButtonProps) => {
  const id = useId();

  return (
    <label className="ml-6 inline-flex items-center">
      <input className="form-radio" id={id} type="radio" value={value} {...register(name, { required: true })} />
      <span className="ml-2">{label}</span>
    </label>
  );
};

export default FormRadioButton;
