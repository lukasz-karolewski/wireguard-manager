import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "~/auth";
import NiceModalProviderWrapper from "~/components/providers";
import Container from "~/components/ui/container";
import Footer from "~/components/ui/footer";
import TopNav from "~/components/ui/top-nav";
import { TRPCReactProvider } from "~/trpc/react";

import { Toaster } from "react-hot-toast";
import "~/app/styles.css";

export const metadata: Metadata = {
  title: "Wireguard Manager",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  return (
    <html>
      <body className="flex min-h-screen flex-col">
        <TRPCReactProvider cookies={cookies().toString()}>
          <NiceModalProviderWrapper>
            <TopNav />
            <Container className="grow">
              <main className="py-6">{children}</main>
            </Container>
            <Footer />
            <Toaster position="bottom-center" />
          </NiceModalProviderWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
