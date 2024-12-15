import React, { forwardRef, InputHTMLAttributes, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const id = useId();
  return (
    <input
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      className="w-full rounded border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      id={id}
      ref={ref}
      role="presentation"
      spellCheck="false"
      type="text"
      {...props}
    />
  );
});

Input.displayName = "Input";
