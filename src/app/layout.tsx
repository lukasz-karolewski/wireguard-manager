import { Metadata } from "next";

import Container from "~/components/ui/container";
import Footer from "~/components/ui/footer";
import TopNav from "~/components/ui/top-nav";

import "~/app/styles.css";

export const metadata: Metadata = {
  title: "Wireguard Manager",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <TopNav />
        <Container id="content" is_full_width={false}>
          <main>{children}</main>
          <Footer />
        </Container>
      </body>
    </html>
  );
}
