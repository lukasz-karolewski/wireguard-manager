export const dynamic = "force-dynamic"; //TODO https://github.com/vercel/next.js/issues/49373

import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

import { auth } from "~/auth";
import NiceModalProviderWrapper from "~/components/providers";
import Container from "~/components/ui/container";
import Footer from "~/components/ui/footer";
import TopNav from "~/components/ui/top-nav";
import { TRPCReactProvider } from "~/trpc/react";
import "~/app/styles.css";

export const metadata: Metadata = {
  title: "Wireguard Manager",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const cookiesList = await cookies();
  const cookiesString = cookiesList.toString();

  return (
    <html>
      <head>{/* <script src="https://unpkg.com/react-scan/dist/auto.global.js"></script> */}</head>
      <body className="flex min-h-dvh flex-col">
        <TRPCReactProvider cookies={cookiesString}>
          <NiceModalProviderWrapper>
            <TopNav />
            <Container className="grow">
              <main className="py-4">{children}</main>
            </Container>
            <Footer />
            <Toaster position="bottom-center" />
          </NiceModalProviderWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
