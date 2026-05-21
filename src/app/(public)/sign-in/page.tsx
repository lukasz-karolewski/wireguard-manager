import { Card } from "~/components/ui/card";
import { OAuthSignInButton } from "~/components/ui/sign-in-button";

export default function SignInPage() {
  return (
    <div className="mx-auto flex min-h-[50dvh] max-w-md items-center">
      <Card className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-gray-600">Use your Google account to access Wireguard Manager.</p>
        </div>
        <OAuthSignInButton className="w-full" provider="google" />
      </Card>
    </div>
  );
}
