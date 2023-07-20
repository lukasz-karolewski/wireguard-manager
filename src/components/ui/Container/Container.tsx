import cn from "classnames";
import React, { FC } from "react";

interface ContainerProps {
  id?: string;
  className?: string;
  children?: any;
  el?: HTMLElement;
  clean?: boolean;
}

const Container: FC<React.PropsWithChildren<ContainerProps>> = ({
  id,
  children,
  className,
  el = "div",
  clean,
}) => {
  const rootClassName = cn(className, {
    "mx-auto max-w-6xl px-6 xl:px-0": !clean,
  });

  const Component: React.ComponentType<
    React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
  > = el as any;

  return (
    <Component id={id} className={rootClassName}>
      {children}
    </Component>
  );
};

export default Container;
