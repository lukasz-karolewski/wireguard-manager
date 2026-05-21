"use client";

import { clsx } from "clsx";
import { diffLines } from "diff";
import { type FC, useMemo, useState } from "react";

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
  const keyedParts = useMemo(() => {
    const partOccurrences = new Map<string, number>();

    return parts.map((part) => {
      const symbol = part.added ? "+" : part.removed ? "-" : " ";
      const partIdentity = `${symbol}:${part.value}`;
      const partOccurrence = partOccurrences.get(partIdentity) ?? 0;
      partOccurrences.set(partIdentity, partOccurrence + 1);

      const lines = part.value.split("\n");
      if (lines.length > 0 && lines.at(-1) === "") {
        lines.pop();
      }

      const lineOccurrences = new Map<string, number>();
      const keyedLines = lines.map((line) => {
        const lineOccurrence = lineOccurrences.get(line) ?? 0;
        lineOccurrences.set(line, lineOccurrence + 1);

        return {
          key: `${partIdentity}:${partOccurrence}:${line}:${lineOccurrence}`,
          line,
        };
      });

      return {
        key: `${partIdentity}:${partOccurrence}`,
        lines: keyedLines,
        part,
        symbol,
      };
    });
  }, [parts]);
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
            className={clsx(
              "rounded px-2 py-1",
              !includeUnchanged ? "bg-blue-600 text-white" : "hover:bg-gray-200 text-gray-700",
            )}
            onClick={() => setIncludeUnchanged(false)}
            type="button"
          >
            Only changes
          </button>
          <button
            className={clsx(
              "rounded px-2 py-1",
              includeUnchanged ? "bg-blue-600 text-white" : "hover:bg-gray-200 text-gray-700",
            )}
            onClick={() => setIncludeUnchanged(true)}
            type="button"
          >
            All lines
          </button>
        </div>
      </div>
      <div className="font-mono text-sm">
        {!includeUnchanged && !hasChanges ? (
          <div className="px-3 py-2 text-gray-500">No changes</div>
        ) : (
          keyedParts.map(({ key, lines, part, symbol }) => {
            if (!includeUnchanged && !(part.added || part.removed)) {
              return null;
            }

            const cls = clsx("whitespace-pre-wrap px-3 py-0.5", {
              "bg-green-50 text-green-700": part.added,
              "bg-red-50 text-red-700": part.removed,
            });

            return lines.map(({ key: lineKey, line }) => (
              <div className={cls} key={`${key}:${lineKey}`}>
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
