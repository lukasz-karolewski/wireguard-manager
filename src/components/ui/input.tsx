import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const id = useId();
  return (
    <input
      id={id}
      ref={ref}
      className="border px-3 py-2 text-gray-900"
      type="text"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      role="presentation"
      {...props}
    />
  );
});

Input.displayName = "Input";
