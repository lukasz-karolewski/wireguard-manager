import { Metadata } from "next";
import { cookies } from "next/headers";

import Container from "~/components/ui/container";
import Footer from "~/components/ui/footer";
import TopNav from "~/components/ui/top-nav";

import "~/app/styles.css";
import NiceModalProviderWrapper from "~/components/providers";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Wireguard Manager",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <TRPCReactProvider cookies={cookies().toString()}>
          <NiceModalProviderWrapper>
            <TopNav />
            <Container id="content" is_full_width={false}>
              <main>{children}</main>
              <Footer />
            </Container>
          </NiceModalProviderWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
