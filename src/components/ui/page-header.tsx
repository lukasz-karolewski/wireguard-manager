import Link from "next/link";
import React from "react";

interface PageHeaderProps {
  children?: React.ReactNode;
  parent?: string | string[];
  parentHref?: string;
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ children, parent, parentHref, title }) => {
  return (
    <div className="mb-4 flex items-center h-10 gap-2">
      <h1>
        {parent && parentHref && (
          <>
            <Link className="hover:underline" href={parentHref}>
              {Array.isArray(parent) ? parent.join(" > ") : parent}
            </Link>
            <span className="mx-2">&gt;</span>
          </>
        )}
        {title}
      </h1>
      <div className="grow"></div>
      {children}
    </div>
  );
};

export default PageHeader;
