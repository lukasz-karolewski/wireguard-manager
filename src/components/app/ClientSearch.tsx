"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { searchAction } from "~/app/actions";

interface ClientSearchProps {
  defaultValue?: string;
}

export function ClientSearch({ defaultValue }: ClientSearchProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchValue, setSearchValue] = useState(defaultValue ?? "");
  const showOnlyMine = searchParams.get("showOnlyMine");

  function handleInput() {
    const currentValue = inputRef.current?.value ?? "";
    setSearchValue(currentValue);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 500);
  }

  function handleClear() {
    if (inputRef.current) {
      inputRef.current.value = "";
      setSearchValue("");
    }

    // Clear search immediately
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`/?${params.toString()}`);
  }

  return (
    <form action={(formData) => searchAction(formData)} className="w-full" ref={formRef}>
      <div className="relative w-full">
        <input
          autoFocus
          className="w-full rounded border px-3 py-2 pr-10 md:w-64"
          defaultValue={defaultValue ?? ""}
          name="search"
          onInput={handleInput}
          placeholder="Search"
          ref={inputRef}
          type="text"
        />
        {searchValue && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            onClick={handleClear}
            type="button"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
        )}
      </div>
      {showOnlyMine && <input name="showOnlyMine" type="hidden" value={showOnlyMine} />}
    </form>
  );
}
