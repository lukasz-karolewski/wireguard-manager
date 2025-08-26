"use client";

import { clsx } from "clsx";
import { diffLines } from "diff";
import { FC, useMemo } from "react";

interface ConfigDiffProps {
  leftLabel?: string;
  newValue: string;
  oldValue: string;
  rightLabel?: string;
}

export const ConfigDiff: FC<ConfigDiffProps> = ({
  leftLabel = "Current",
  newValue,
  oldValue,
  rightLabel = "Proposed",
}) => {
  const parts = useMemo(() => diffLines(oldValue, newValue), [newValue, oldValue]);

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="border-b bg-gray-50 px-3 py-2 text-xs text-gray-500">
        Inline diff: {leftLabel} → {rightLabel}
      </div>
      <div className="font-mono text-sm">
        {parts.map((part, pIdx) => {
          const symbol = part.added ? "+" : part.removed ? "-" : " ";
          const cls = clsx("whitespace-pre-wrap px-3 py-0.5", {
            "bg-green-50 text-green-700": part.added,
            "bg-red-50 text-red-700": part.removed,
          });

          // Split into individual lines to render nicely
          const lines = part.value.split("\n");
          // Remove trailing empty line to avoid extra blank row at the end
          if (lines.length > 0 && lines.at(-1) === "") {
            lines.pop();
          }

          return lines.map((line, lIdx) => (
            <div className={cls} key={`diff-${pIdx}-${lIdx}`}>
              <span className="mr-2 opacity-60">{symbol}</span>
              <span>{line}</span>
            </div>
          ));
        })}
      </div>
    </div>
  );
};
