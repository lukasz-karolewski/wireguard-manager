"use client";

import { clsx } from "clsx";
import { diffLines } from "diff";
import { FC, useMemo, useState } from "react";

interface ConfigDiffProps {
  leftLabel?: string;
  newValue: string;
  oldValue: string;
  rightLabel?: string;
  /**
   * When false, unchanged lines are hidden and only additions/removals are shown.
   * Defaults to true to preserve existing behavior.
   */
  showUnchanged?: boolean;
}

export const ConfigDiff: FC<ConfigDiffProps> = ({
  leftLabel = "Current",
  newValue,
  oldValue,
  rightLabel = "Proposed",
  showUnchanged = false,
}) => {
  const parts = useMemo(() => diffLines(oldValue, newValue), [newValue, oldValue]);
  const hasChanges = useMemo(() => parts.some((p) => p.added || p.removed), [parts]);
  // Local toggle: whether to include unchanged lines (default from prop)
  const [includeUnchanged, setIncludeUnchanged] = useState<boolean>(showUnchanged);

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="flex items-center justify-between border-b bg-gray-50 px-3 py-2 text-xs text-gray-500">
        <div>
          Inline diff: {leftLabel} → {rightLabel}
        </div>
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            className={clsx(
              "rounded px-2 py-1",
              !includeUnchanged ? "bg-blue-600 text-white" : "hover:bg-gray-200 text-gray-700",
            )}
            onClick={() => setIncludeUnchanged(false)}
          >
            Only changes
          </button>
          <button
            type="button"
            className={clsx(
              "rounded px-2 py-1",
              includeUnchanged ? "bg-blue-600 text-white" : "hover:bg-gray-200 text-gray-700",
            )}
            onClick={() => setIncludeUnchanged(true)}
          >
            All lines
          </button>
        </div>
      </div>
      <div className="font-mono text-sm">
        {!includeUnchanged && !hasChanges ? (
          <div className="px-3 py-2 text-gray-500">No changes</div>
        ) : (
          parts.map((part, pIdx) => {
            if (!includeUnchanged && !(part.added || part.removed)) {
              return null;
            }

            const symbol = part.added ? "+" : part.removed ? "-" : " ";
            const cls = clsx("whitespace-pre-wrap px-3 py-0.5", {
              "bg-green-50 text-green-700": part.added,
              "bg-red-50 text-red-700": part.removed,
            });

            const lines = part.value.split("\n");
            if (lines.length > 0 && lines.at(-1) === "") {
              lines.pop();
            }

            return lines.map((line, lIdx) => (
              <div className={cls} key={`diff-${pIdx}-${lIdx}`}>
                <span className="mr-2 opacity-60 select-none">{symbol}</span>
                <span>{line}</span>
              </div>
            ));
          })
        )}
      </div>
    </div>
  );
};
