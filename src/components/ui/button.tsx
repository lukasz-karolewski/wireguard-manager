import { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";

export const Button: FC<PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={`rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
