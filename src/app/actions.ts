"use server";

import { redirect } from "next/navigation";

export async function searchAction(formData: FormData) {
  const search = formData.get("search") as string;
  const showOnlyMine = formData.get("showOnlyMine") as string;
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (showOnlyMine === "false") {
    params.set("showOnlyMine", "false");
  }

  await Promise.resolve(); // Satisfy async requirement
  redirect(`/?${params.toString()}`);
}
