import React, { type InputHTMLAttributes, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: React.RefCallback<HTMLInputElement> | React.RefObject<HTMLInputElement>;
}

export const Input = ({ ref, ...props }: InputProps) => {
  const id = useId();
  return (
    <input
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      className="w-full rounded-sm border border-gray-300 px-4 py-2 text-gray-900 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500/50"
      id={id}
      ref={ref}
      role="presentation"
      spellCheck="false"
      type="text"
      {...props}
    />
  );
};

Input.displayName = "Input";
