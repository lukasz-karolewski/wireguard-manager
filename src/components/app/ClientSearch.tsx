"use client";

import { useRef } from "react";

import { searchAction } from "~/app/actions";

interface ClientSearchProps {
  defaultValue?: string;
}

export function ClientSearch({ defaultValue }: ClientSearchProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  function handleInput() {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 500);
  }

  return (
    <form action={(formData) => searchAction(formData)} ref={formRef}>
      <input
        autoFocus
        className="rounded border px-3 py-2"
        defaultValue={defaultValue ?? ""}
        name="search"
        onInput={handleInput}
        placeholder="Search"
        type="text"
      />
    </form>
  );
}
