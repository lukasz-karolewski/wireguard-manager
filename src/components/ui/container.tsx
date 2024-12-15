import { clsx } from "clsx";
import { FC, PropsWithChildren } from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: any;
  className?: string;
  is_full_width?: boolean;
}

const Container: FC<PropsWithChildren<ContainerProps>> = ({
  children,
  className,
  is_full_width,
  ...props
}) => {
  return (
    <div
      className={clsx(className, {
        "mx-auto max-w-6xl px-6 min-w-min w-full": !is_full_width,
      })}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
