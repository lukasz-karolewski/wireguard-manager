type FormRadioButtonProps = {
  name: string;
  value: string;
  label: string;
  register: any;
};

const FormRadioButton = ({ name, value, label, register }: FormRadioButtonProps) => (
  <label className="ml-6 inline-flex items-center">
    <input
      type="radio"
      className="form-radio"
      value={value}
      {...register(name, { required: true })}
    />
    <span className="ml-2">{label}</span>
  </label>
);

export default FormRadioButton;
