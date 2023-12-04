import { VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";
import { ButtonHTMLAttributes, FC } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-white hover:bg-blue-500/90",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border bg-white hover:border-black",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 ",
        ghost: "hover:bg-accent hover:text-white",
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-6 px-2 text-sm",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10",
        inline: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
}

export const Button: FC<ButtonProps> = ({ children, className, variant, size, ...props }) => {
  return (
    <button className={clsx(buttonVariants({ variant, size, className }))} {...props}>
      {children}
      <p className="h-10"></p>
    </button>
  );
};
