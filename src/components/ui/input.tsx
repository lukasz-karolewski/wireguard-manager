import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ name, ...props }, ref) => {
  const id = useId();
  return (
    <input
      id={id}
      ref={ref}
      className="border px-3 py-2 text-gray-900"
      type="text"
      {...props}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
    />
  );
});

Input.displayName = "Input";
