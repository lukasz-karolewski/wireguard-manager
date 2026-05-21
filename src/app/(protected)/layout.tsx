import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";

import NiceModalProviderWrapper from "~/components/providers";
import Container from "~/components/ui/container";
import Footer from "~/components/ui/footer";
import TopNav from "~/components/ui/top-nav";
import { TRPCReactProvider } from "~/trpc/react";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookiesList = await cookies();
  const cookiesString = cookiesList.toString();

  return (
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
  );
}
