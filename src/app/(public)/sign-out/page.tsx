import { Card } from "~/components/ui/card";
import { SignOutPanel } from "~/components/ui/sign-out-panel";

export default function SignOutPage() {
  return (
    <Card className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Sign out</h1>
        <SignOutPanel />
      </div>
    </Card>
  );
}
