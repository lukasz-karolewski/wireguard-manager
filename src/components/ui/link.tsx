"use client";

import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

type ActiveLinkProps = LinkProps & {
  className?: string;
  activeClassName?: string;
};

const ActiveLink = ({
  children,
  className,
  activeClassName = "border-b-2 border-b-highlight",
  ...props
}: PropsWithChildren<ActiveLinkProps>) => {
  const pathname = usePathname();

  return (
    <Link className={clsx(className, { [activeClassName]: pathname === props.href })} {...props}>
      {children}
    </Link>
  );
};

export default ActiveLink;
