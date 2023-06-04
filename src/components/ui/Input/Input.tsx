type InputProps = {
  name: string;
  register: any;
};

const Input = ({ name, register }: InputProps) => (
  <input
    className="border py-2 px-3 text-gray-900"
    type="text"
    {...register(name, { required: true })}
  />
);

export default Input;
