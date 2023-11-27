interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  register: any;
}

export const Input = ({ name, register }: InputProps) => (
  <input
    className="border px-3 py-2 text-gray-900"
    type="text"
    {...register(name, { required: true })}
  />
);
