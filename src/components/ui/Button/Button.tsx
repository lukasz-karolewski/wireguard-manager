import React, { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";

const Button: FC<PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 mx-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// type ButtonProps = {
//   type?: "button" | "submit" | "reset";
//   onClick?: () => void;
//   children: React.ReactNode;
//   className?: string;
// };

// const Button = ({ type = "button", onClick, children, className }: ButtonProps) => (
//   <button
//     type={type}
//     onClick={onClick}
//     className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`}
//   >
//     {children}
//   </button>
// );

export default Button;
