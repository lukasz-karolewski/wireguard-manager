import { redirect } from "next/navigation";

import { Button } from "./button";

export function SignIn({ provider, ...props }: React.ComponentPropsWithRef<typeof Button> & { provider?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        redirect(`/sign-in${provider ? `?provider=${provider}` : ""}`);
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
        redirect("/sign-out");
      }}
    >
      <Button className="whitespace-nowrap" {...props}>
        Sign Out
      </Button>
    </form>
  );
}
