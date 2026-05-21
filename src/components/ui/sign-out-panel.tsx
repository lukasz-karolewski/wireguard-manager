"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { authClient } from "~/auth-client";

export function SignOutPanel() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const signOut = async () => {
      await authClient.signOut();

      if (!cancelled) {
        router.replace("/sign-in");
        router.refresh();
      }
    };

    void signOut();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return <p className="text-sm text-gray-600">Signing out...</p>;
}
