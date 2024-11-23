import React, { useId } from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const id = useId();
  return (
    <input
      id={id}
      ref={ref}
      className=""
      type="checkbox"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      role="presentation"
      {...props}
    />
  );
});

Checkbox.displayName = "Checkbox";
