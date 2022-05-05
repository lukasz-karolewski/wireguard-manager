import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Link: React.FC<React.PropsWithChildren<NextLinkProps>> = ({ href, children }) => {
  const router = useRouter();

  if (!React.isValidElement(children)) return null;

  let className = children.props.className || "";
  if (router.pathname === href) {
    className = `${className} active`;
  }

  return <NextLink href={href}>{React.cloneElement(children, { className })}</NextLink>;
};

export default Link;
