import Link from "next/link";
import React from "react";

interface PageHeaderProps {
  title: string;
  parent?: string;
  parentHref?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, parent, parentHref, children }) => {
  return (
    <div className="mb-4 flex items-center justify-center gap-2">
      <h1>
        {parent && parentHref && (
          <>
            <Link href={parentHref} className="hover:underline">
              {parent}
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
