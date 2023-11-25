import clsx from "clsx";
import { ComponentType, FC, HTMLAttributes, PropsWithChildren } from "react";

interface ContainerProps {
  id?: string;
  className?: string;
  children?: any;
  el?: HTMLElement;
  is_full_width?: boolean;
}

const Container: FC<PropsWithChildren<ContainerProps>> = ({
  id,
  children,
  className,
  el = "div",
  is_full_width,
}) => {
  const rootClassName = clsx(className, {
    "mx-auto max-w-6xl px-6 xl:px-0": !is_full_width,
  });

  const Component: ComponentType<PropsWithChildren<HTMLAttributes<HTMLDivElement>>> = el as any;

  return (
    <Component id={id} className={rootClassName}>
      {children}
    </Component>
  );
};

export default Container;
