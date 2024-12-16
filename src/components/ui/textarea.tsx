import React, { TextareaHTMLAttributes, useId } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref: React.RefObject<HTMLTextAreaElement>;
}

export const Textarea = ({ ref, ...props }: TextareaProps) => {
  const id = useId();
  return (
    <textarea
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      className="w-full rounded border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      id={id}
      ref={ref}
      role="presentation"
      rows={2}
      spellCheck="false"
      {...props}
    />
  );
};

Textarea.displayName = "Textarea";
