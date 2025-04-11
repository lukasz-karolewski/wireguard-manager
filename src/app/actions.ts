"use server";

import { redirect } from "next/navigation";

export async function searchAction(formData: FormData) {
  const search = formData.get("search") as string;
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  await Promise.resolve(); // Satisfy async requirement
  redirect(`/?${params.toString()}`);
}
