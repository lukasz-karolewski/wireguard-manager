import React, { useId } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const id = useId();
  return (
    <select
      id={id}
      ref={ref}
      className="w-full rounded border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      role="presentation"
      {...props}
    />
  );
});

Select.displayName = "Select";
