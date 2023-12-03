import React from "react";

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
  return (
    <div className="mb-4 flex justify-center gap-2">
      <h1>{title}</h1>
      <div className="grow"></div>
      {children}
    </div>
  );
};

export default PageHeader;
