"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function ClientFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const showOnlyMine = searchParams.get("showOnlyMine") !== "false"; // default to true

  const updateFilter = useCallback(
    (newShowOnlyMine: boolean) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newShowOnlyMine) {
        params.delete("showOnlyMine"); // default is true, so remove param
      } else {
        params.set("showOnlyMine", "false");
      }

      router.push(`/?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="flex items-center space-x-3">
      <div className="flex rounded-md border bg-gray-50">
        <button
          className={`px-3 py-2 font-medium transition-colors ${
            showOnlyMine ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
          } rounded-l-md border-r`}
          onClick={() => {
            updateFilter(true);
          }}
          type="button"
        >
          My Clients
        </button>
        <button
          className={`px-3 py-2 font-medium transition-colors ${
            showOnlyMine ? "text-gray-700 hover:bg-gray-100" : "bg-blue-500 text-white"
          } rounded-r-md`}
          onClick={() => {
            updateFilter(false);
          }}
          type="button"
        >
          All Clients
        </button>
      </div>
    </div>
  );
}
