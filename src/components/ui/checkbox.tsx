import type React from "react";
import { type InputHTMLAttributes, useId } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  ref: React.RefCallback<HTMLInputElement> | React.RefObject<HTMLInputElement>;
}

export const Checkbox = ({ ref, ...props }: CheckboxProps) => {
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
};

Checkbox.displayName = "Checkbox";
