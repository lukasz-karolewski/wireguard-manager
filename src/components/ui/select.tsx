import React, { forwardRef, SelectHTMLAttributes, useId } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ ...props }, ref) => {
  const id = useId();
  return (
    <select
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      className="w-full rounded-sm border border-gray-300 px-4 py-2 text-gray-900 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500/50"
      id={id}
      ref={ref}
      role="presentation"
      spellCheck="false"
      {...props}
    />
  );
});

Select.displayName = "Select";
