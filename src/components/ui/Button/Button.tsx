import React, { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";

const Button: FC<PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>> = ({
  children,
  ...props
}) => {
  return (
    <button
      className="px-4 py-2 mx-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
