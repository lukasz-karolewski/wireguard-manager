"use client";

import { authClient } from "~/auth-client";

import { Button } from "./button";

export function OAuthSignInButton({
  provider = "google",
  ...props
}: React.ComponentPropsWithRef<typeof Button> & { provider?: "google" }) {
  return (
    <Button
      className="whitespace-nowrap"
      onClick={() => {
        void authClient.signIn.social({
          callbackURL: "/",
          provider,
        });
      }}
      type="button"
      {...props}
    >
      Sign In
    </Button>
  );
}
