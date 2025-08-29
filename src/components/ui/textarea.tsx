import type React from "react";
import { type TextareaHTMLAttributes, useId } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref: React.RefCallback<HTMLTextAreaElement> | React.RefObject<HTMLTextAreaElement>;
}

export const Textarea = ({ ref, ...props }: TextareaProps) => {
  const id = useId();
  return (
    <textarea
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      className="w-full rounded-sm border border-gray-300 px-4 py-2 text-gray-900 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500/50"
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
