import React, { useId } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  const id = useId();
  return (
    <textarea
      id={id}
      ref={ref}
      className="w-full rounded border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      role="presentation"
      rows={2}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
