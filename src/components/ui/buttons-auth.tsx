import { redirect } from "next/navigation";

import { signIn, signOut } from "~/auth";

import { Button } from "./button";

export function SignIn({
  provider,
  ...props
}: React.ComponentPropsWithRef<typeof Button> & { provider?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        const url = await signIn(provider, { redirect: false });
        redirect(url);
      }}
    >
      <Button className="whitespace-nowrap" {...props}>
        Sign In
      </Button>
    </form>
  );
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button className="whitespace-nowrap" {...props}>
        Sign Out
      </Button>
    </form>
  );
}
