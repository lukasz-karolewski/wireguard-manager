import { clsx } from "clsx";
import type { FC, PropsWithChildren, ReactNode } from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode | ReactNode[];
  className?: string;
  is_full_width?: boolean;
}

const Container: FC<PropsWithChildren<ContainerProps>> = ({ children, className, is_full_width, ...props }) => {
  return (
    <div
      className={clsx(className, {
        "mx-auto w-full max-w-6xl px-6 min-w-0": !is_full_width,
      })}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
