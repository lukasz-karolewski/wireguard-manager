import { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export const Input = ({ name, ...props }: InputProps) => {
  const id = useId();
  return (
    <input
      id={id}
      className="border px-3 py-2 text-gray-900"
      type="text"
      {...props}
      autoComplete="off"
    />
  );
};
