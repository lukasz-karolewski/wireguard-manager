import { cva, VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { ButtonHTMLAttributes, FC } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-10 px-4 py-2",
        icon: "size-10",
        inline: "p-0",
        lg: "h-12 px-8 text-lg",
        sm: "h-6 px-2 text-sm",
      },
      variant: {
        default: "bg-blue-500 text-white hover:bg-blue-500/90",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        ghost: "hover:bg-accent hover:text-white",
        link: "text-blue-600 underline-offset-4 hover:underline",
        outline: "border bg-white hover:border-black",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 ",
      },
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
}

export const Button: FC<ButtonProps> = ({ children, className, size, variant, ...props }) => {
  return (
    <button className={clsx(buttonVariants({ className, size, variant }))} {...props}>
      {children}
      <p className="h-10"></p>
    </button>
  );
};
