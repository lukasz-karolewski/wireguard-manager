type InputProps = {
  name: string;
  register: any;
};

const Input = ({ name, register }: InputProps) => (
  <input
    className="border px-3 py-2 text-gray-900"
    type="text"
    {...register(name, { required: true })}
  />
);

export default Input;
