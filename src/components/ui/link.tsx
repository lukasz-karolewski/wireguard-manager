"use client";

import { clsx } from "clsx";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

type ActiveLinkProps = LinkProps & {
  activeClassName?: string;
  className?: string;
};

const ActiveLink = ({
  activeClassName = "border-b-2 border-b-highlight",
  children,
  className,
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
