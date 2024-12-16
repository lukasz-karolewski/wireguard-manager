import React, { SelectHTMLAttributes, useId } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  ref: React.RefObject<HTMLSelectElement>;
}

export const Select = ({ ref, ...props }: SelectProps) => {
  const id = useId();
  return (
    <select
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      className="w-full rounded border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      id={id}
      ref={ref}
      role="presentation"
      spellCheck="false"
      {...props}
    />
  );
};

Select.displayName = "Select";
