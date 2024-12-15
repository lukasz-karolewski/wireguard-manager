import React, { forwardRef, InputHTMLAttributes, useId } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const id = useId();
  return (
    <input
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      className=""
      id={id}
      ref={ref}
      role="presentation"
      spellCheck="false"
      type="checkbox"
      {...props}
    />
  );
});

Checkbox.displayName = "Checkbox";
